import datetime
import uuid
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def generate_batch_id():
    return f"TXT-{uuid.uuid4().hex[:6].upper()}"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False) # Admin, Operator, Manager, Manufacturer
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    batches = relationship("WasteBatch", back_populates="creator")

class WasteBatch(Base):
    __tablename__ = "waste_batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String, unique=True, index=True, default=generate_batch_id, nullable=False)
    fabric_type = Column(String, nullable=False) # Cotton, Polyester, etc.
    source = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    color = Column(String, nullable=False)
    condition = Column(String, nullable=False) # Clean, Contaminated, Damaged
    collection_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Image analysis columns
    image_url = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    recyclability_score = Column(Float, nullable=True)
    
    # Sustainability intelligence columns
    circularity_score = Column(Float, nullable=True)
    co2_savings_kg = Column(Float, nullable=True)
    water_savings_liters = Column(Float, nullable=True)
    recycling_strategy = Column(String, nullable=True)
    
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="batches")
