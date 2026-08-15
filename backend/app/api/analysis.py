import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_active_user
from app.models.user import User
from app.models.waste import WasteBatch
from app.models.analysis import AnalysisRecord
from app.schemas.analysis import AnalysisRecordResponse
from app.services.ai_engine import AIEngine
from app.services.sustainability_engine import SustainabilityEngine
from app.services.scoring_engine import ScoringEngine

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/{batch_id}", response_model=AnalysisRecordResponse)
def analyze_batch_image(
    batch_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 1. Fetch batch
    batch = db.query(WasteBatch).filter(WasteBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Waste batch not found")

    # 2. Save file
    file_ext = os.path.splitext(file.filename)[1]
    safe_filename = f"batch_{batch.batch_id}_{batch_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Analyze image using AI Engine
    ai_result = AIEngine.analyze_image(file_path)

    # 4. Perform sustainability environmental calculations
    env_result = SustainabilityEngine.calculate_environmental_impact(
        fabric_type=ai_result["fabric_type_detected"],
        quantity=batch.quantity,
        recyclability_score=ai_result["recyclability_score"]
    )

    # 5. Compute circularity & recovery potential category
    circ_result = ScoringEngine.calculate_circularity_score(
        recyclability_score=ai_result["recyclability_score"],
        condition="Damaged" if ai_result["damage_detected"] else ("Contaminated" if ai_result["contamination_detected"] else "Good"),
        reuse_score=ai_result["reuse_score"],
        sustainability_score=ai_result["sustainability_score"],
        fabric_type=ai_result["fabric_type_detected"]
    )

    # 6. Update Batch information based on AI Detection
    batch.fabric_type = ai_result["fabric_type_detected"]
    if ai_result["contamination_detected"]:
        batch.condition = "Contaminated"
    elif ai_result["damage_detected"]:
        batch.condition = "Damaged"
    else:
        batch.condition = "Good"
        
    # 7. Update/Create Analysis Record
    analysis = db.query(AnalysisRecord).filter(AnalysisRecord.waste_batch_id == batch_id).first()
    if not analysis:
        analysis = AnalysisRecord(waste_batch_id=batch_id)

    analysis.image_path = file_path
    analysis.fabric_type_detected = ai_result["fabric_type_detected"]
    analysis.blend_details = ai_result["blend_details"]
    analysis.quality_score = ai_result["quality_score"]
    analysis.damage_detected = ai_result["damage_detected"]
    analysis.contamination_detected = ai_result["contamination_detected"]
    
    # New Visual details mapping
    analysis.fabric_texture = ai_result["fabric_texture"]
    analysis.fabric_pattern = ai_result["fabric_pattern"]
    analysis.fabric_color = ai_result["fabric_color"]
    analysis.damage_details = ai_result["damage_details"]
    analysis.contamination_details = ai_result["contamination_details"]
    
    analysis.recyclability_score = ai_result["recyclability_score"]
    analysis.reuse_score = ai_result["reuse_score"]
    analysis.sustainability_score = ai_result["sustainability_score"]
    analysis.material_recovery_score = ai_result["material_recovery_score"]
    analysis.circularity_score = circ_result["circularity_score"]
    analysis.waste_category = circ_result["circularity_category"]
    analysis.recycling_strategy = ai_result["recycling_strategy"]
    analysis.co2_savings = env_result["co2_savings"]
    analysis.water_savings = env_result["water_savings"]
    analysis.landfill_reduction = env_result["landfill_reduction"]
    analysis.resource_conservation = env_result["resource_conservation"]

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return analysis
