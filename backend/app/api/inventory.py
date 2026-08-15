from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from app.core.database import get_db
from app.api.auth import get_current_active_user
from app.models.user import User
from app.models.waste import WasteBatch
from app.models.analysis import AnalysisRecord
from app.schemas.waste import WasteBatchCreate, WasteBatchResponse
from app.services.ai_engine import AIEngine
from app.services.sustainability_engine import SustainabilityEngine
from app.services.scoring_engine import ScoringEngine

router = APIRouter()

@router.get("/", response_model=List[WasteBatchResponse])
def get_batches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    fabric_type: Optional[str] = None
):
    query = db.query(WasteBatch)
    if fabric_type:
        query = query.filter(WasteBatch.fabric_type == fabric_type)
    return query.order_by(WasteBatch.collection_date.desc()).all()

@router.post("/", response_model=WasteBatchResponse, status_code=status.HTTP_201_CREATED)
def create_batch(
    batch_in: WasteBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check duplicate batch ID
    existing = db.query(WasteBatch).filter(WasteBatch.batch_id == batch_in.batch_id).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Batch ID '{batch_in.batch_id}' is already registered."
        )

    # 1. Save waste batch
    new_batch = WasteBatch(
        batch_id=batch_in.batch_id,
        fabric_type=batch_in.fabric_type,
        source=batch_in.source,
        quantity=batch_in.quantity,
        color=batch_in.color,
        condition=batch_in.condition,
        registered_by_id=current_user.id,
        collection_date=datetime.datetime.utcnow()
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    # 2. Automatically perform baseline analysis based on inputted properties
    # Simulate AI analysis parameters
    mock_ai = AIEngine._generate_fallback_mock()
    # Align mock analysis parameters with manual inputs
    mock_ai["fabric_type_detected"] = batch_in.fabric_type
    mock_ai["blend_details"] = f"100% {batch_in.fabric_type}" if batch_in.fabric_type != "Blend" else "Cotton 65%, Polyester 35%"
    
    # Calculate scores dynamically
    quality_score = 90.0 if batch_in.condition == "Good" else (70.0 if batch_in.condition == "Worn" else (40.0 if batch_in.condition == "Damaged" else 15.0))
    mock_ai["quality_score"] = quality_score
    mock_ai["damage_detected"] = batch_in.condition == "Damaged"
    mock_ai["contamination_detected"] = batch_in.condition == "Contaminated"
    
    recyclability_score = AIEngine._calculate_recyclability(batch_in.fabric_type, quality_score, mock_ai["contamination_detected"])
    mock_ai["recyclability_score"] = recyclability_score
    mock_ai["reuse_score"] = quality_score if not mock_ai["contamination_detected"] else max(5.0, quality_score - 20)
    mock_ai["sustainability_score"] = AIEngine._calculate_sustainability_score(batch_in.fabric_type, recyclability_score)
    mock_ai["material_recovery_score"] = recyclability_score * 0.85
    
    # Circularity calculation
    circ_info = ScoringEngine.calculate_circularity_score(
        recyclability_score=mock_ai["recyclability_score"],
        condition=batch_in.condition,
        reuse_score=mock_ai["reuse_score"],
        sustainability_score=mock_ai["sustainability_score"],
        fabric_type=batch_in.fabric_type
    )
    mock_ai["circularity_score"] = circ_info["circularity_score"]
    mock_ai["waste_category"] = circ_info["circularity_category"]
    
    # Environmental calculations
    env_info = SustainabilityEngine.calculate_environmental_impact(
        fabric_type=batch_in.fabric_type,
        quantity=batch_in.quantity,
        recyclability_score=recyclability_score
    )

    analysis_record = AnalysisRecord(
        waste_batch_id=new_batch.id,
        fabric_type_detected=batch_in.fabric_type,
        blend_details=mock_ai["blend_details"],
        quality_score=quality_score,
        damage_detected=mock_ai["damage_detected"],
        contamination_detected=mock_ai["contamination_detected"],
        recyclability_score=recyclability_score,
        reuse_score=mock_ai["reuse_score"],
        sustainability_score=mock_ai["sustainability_score"],
        material_recovery_score=mock_ai["material_recovery_score"],
        circularity_score=circ_info["circularity_score"],
        waste_category=mock_ai["waste_category"],
        recycling_strategy=mock_ai["recycling_strategy"],
        co2_savings=env_info["co2_savings"],
        water_savings=env_info["water_savings"],
        landfill_reduction=env_info["landfill_reduction"],
        resource_conservation=env_info["resource_conservation"]
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(new_batch)
    return new_batch

@router.get("/{id}", response_model=WasteBatchResponse)
def get_batch_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    batch = db.query(WasteBatch).filter(WasteBatch.id == id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_batch(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only allow Admin, Manager or Operator
    batch = db.query(WasteBatch).filter(WasteBatch.id == id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    db.delete(batch)
    db.commit()
    return None
