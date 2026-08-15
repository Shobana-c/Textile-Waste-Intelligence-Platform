from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AnalysisRecordBase(BaseModel):
    fabric_type_detected: str
    blend_details: str
    quality_score: float
    damage_detected: bool
    contamination_detected: bool
    
    # New Visual Features
    fabric_texture: Optional[str] = None
    fabric_pattern: Optional[str] = None
    fabric_color: Optional[str] = None
    damage_details: Optional[str] = None
    contamination_details: Optional[str] = None
    
    recyclability_score: float
    reuse_score: float
    sustainability_score: float
    material_recovery_score: float
    circularity_score: float
    waste_category: str
    recycling_strategy: str
    co2_savings: float
    water_savings: float
    landfill_reduction: float
    resource_conservation: float

class AnalysisRecordCreate(AnalysisRecordBase):
    waste_batch_id: int
    image_path: Optional[str] = None

class AnalysisRecordResponse(AnalysisRecordBase):
    id: int
    waste_batch_id: int
    image_path: Optional[str] = None
    analyzed_at: datetime

    class Config:
        from_attributes = True
