from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.api.auth import get_current_active_user
from app.models.user import User
from app.models.waste import WasteBatch
from app.services.export_service import ExportService
from app.schemas.waste import WasteBatchResponse

router = APIRouter()

def get_serialized_batches(db: Session) -> list:
    # Fetch all batches and turn them into serializable dicts
    batches = db.query(WasteBatch).all()
    serialized = []
    for b in batches:
        analysis_dict = {}
        if b.analysis:
            analysis_dict = {
                "fabric_type_detected": b.analysis.fabric_type_detected,
                "blend_details": b.analysis.blend_details,
                "quality_score": b.analysis.quality_score,
                "damage_detected": b.analysis.damage_detected,
                "contamination_detected": b.analysis.contamination_detected,
                "fabric_texture": b.analysis.fabric_texture,
                "fabric_pattern": b.analysis.fabric_pattern,
                "fabric_color": b.analysis.fabric_color,
                "damage_details": b.analysis.damage_details,
                "contamination_details": b.analysis.contamination_details,
                "recyclability_score": b.analysis.recyclability_score,
                "reuse_score": b.analysis.reuse_score,
                "sustainability_score": b.analysis.sustainability_score,
                "material_recovery_score": b.analysis.material_recovery_score,
                "circularity_score": b.analysis.circularity_score,
                "waste_category": b.analysis.waste_category,
                "recycling_strategy": b.analysis.recycling_strategy,
                "co2_savings": b.analysis.co2_savings,
                "water_savings": b.analysis.water_savings,
                "landfill_reduction": b.analysis.landfill_reduction,
                "resource_conservation": b.analysis.resource_conservation,
            }
        serialized.append({
            "batch_id": b.batch_id,
            "collection_date": b.collection_date.strftime("%Y-%m-%d %H:%M:%S"),
            "fabric_type": b.fabric_type,
            "source": b.source,
            "quantity": b.quantity,
            "color": b.color,
            "condition": b.condition,
            "analysis": analysis_dict
        })
    return serialized

@router.get("/excel")
def export_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    batches = get_serialized_batches(db)
    if not batches:
        raise HTTPException(status_code=400, detail="No batches available to export.")
        
    excel_stream = ExportService.generate_excel_report(batches)
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=textile_waste_report.xlsx"}
    )

@router.get("/pdf")
def export_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    batches = get_serialized_batches(db)
    if not batches:
        raise HTTPException(status_code=400, detail="No batches available to export.")
        
    pdf_stream = ExportService.generate_pdf_report(batches)
    return StreamingResponse(
        pdf_stream,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=textile_waste_report.pdf"}
    )
