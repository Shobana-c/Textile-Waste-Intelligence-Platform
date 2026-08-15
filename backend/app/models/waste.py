from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime

class WasteBatch(Base):
    __tablename__ = "waste_batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String, unique=True, index=True, nullable=False)
    fabric_type = Column(String, nullable=False)
    source = Column(String, nullable=False)
    quantity = Column(Float, nullable=False) # in kg
    color = Column(String, nullable=False)
    condition = Column(String, nullable=False) # Good, Worn, Damaged, Contaminated
    collection_date = Column(DateTime, default=datetime.datetime.utcnow)
    registered_by_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    registered_by = relationship("User", back_populates="batches")
    analysis = relationship("AnalysisRecord", back_populates="batch", uselist=False, cascade="all, delete-orphan")
