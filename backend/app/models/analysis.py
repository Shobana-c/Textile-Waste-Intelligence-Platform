from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    waste_batch_id = Column(Integer, ForeignKey("waste_batches.id"), unique=True)
    image_path = Column(String, nullable=True)
    
    # Computer Vision & Material Classification outputs
    fabric_type_detected = Column(String, nullable=False)
    blend_details = Column(String, nullable=False) # e.g. "Cotton 80%, Polyester 20%"
    quality_score = Column(Float, default=100.0) # 0 to 100
    damage_detected = Column(Boolean, default=False)
    contamination_detected = Column(Boolean, default=False)
    
    # New Visual Features from Requirements Doc
    fabric_texture = Column(String, nullable=True)     # Woven, Knit, Smooth, Rough
    fabric_pattern = Column(String, nullable=True)     # Solid, Striped, Print, Plaid
    fabric_color = Column(String, nullable=True)       # Dominant hex code or color name
    damage_details = Column(String, nullable=True)     # specific tear/fray description
    contamination_details = Column(String, nullable=True) # specific stain/dirt description
    
    # Scoring
    recyclability_score = Column(Float, default=0.0) # 0 to 100
    reuse_score = Column(Float, default=0.0)
    sustainability_score = Column(Float, default=0.0)
    material_recovery_score = Column(Float, default=0.0)
    circularity_score = Column(Float, default=0.0) # Weighted circularity score
    
    # Recommendations
    waste_category = Column(String, nullable=False) # Recyclable, Reusable, Repairable, Upcyclable, Compostable, Hazardous
    recycling_strategy = Column(String, nullable=False) # Fiber Recycling, Mechanical, Chemical, Fabric Reuse, Upcycling, Donation, Industrial Recovery, Disposal
    
    # Environmental Impact
    co2_savings = Column(Float, default=0.0) # kg CO2
    water_savings = Column(Float, default=0.0) # liters
    landfill_reduction = Column(Float, default=0.0) # kg
    resource_conservation = Column(Float, default=0.0) # kg raw materials saved
    
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    batch = relationship("WasteBatch", back_populates="analysis")
