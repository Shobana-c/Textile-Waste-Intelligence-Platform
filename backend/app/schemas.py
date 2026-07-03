from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List

# --- AUTH SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = Field(description="Role must be: Recycling Facility Operator, Sustainability Manager, Textile Manufacturer, or Administrator")

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- WASTE INVENTORY SCHEMAS ---
class WasteBatchBase(BaseModel):
    fabric_type: str
    source: str
    quantity_kg: float = Field(gt=0, description="Quantity must be greater than 0")
    color: str
    condition: str = Field(description="Condition must be: Clean, Contaminated, or Damaged")
    collection_date: date
    image_url: Optional[str] = None
    confidence_score: Optional[float] = None
    recyclability_score: Optional[float] = None
    circularity_score: Optional[float] = None
    co2_savings_kg: Optional[float] = None
    water_savings_liters: Optional[float] = None
    recycling_strategy: Optional[str] = None

class WasteBatchCreate(WasteBatchBase):
    pass

class WasteBatchResponse(WasteBatchBase):
    id: int
    batch_id: str
    created_at: datetime
    creator_id: int

    class Config:
        from_attributes = True
