from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.analysis import AnalysisRecordResponse

class WasteBatchBase(BaseModel):
    batch_id: str
    fabric_type: str
    source: str
    quantity: float
    color: str
    condition: str

class WasteBatchCreate(WasteBatchBase):
    pass

class WasteBatchResponse(WasteBatchBase):
    id: int
    collection_date: datetime
    registered_by_id: Optional[int] = None
    analysis: Optional[AnalysisRecordResponse] = None

    class Config:
        from_attributes = True
