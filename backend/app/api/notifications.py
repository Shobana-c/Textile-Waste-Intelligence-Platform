from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_active_user
from app.models.user import User
from app.models.waste import WasteBatch

router = APIRouter()

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Calculate real-time database figures to insert in the alert logs
    batch_count = db.query(WasteBatch).count()
    total_weight = sum([b.quantity for b in db.query(WasteBatch).all()])
    
    notifications = [
        {
            "id": 1,
            "type": "opportunity",
            "title": "B2B Sourcing Match Found",
            "message": "Patagonia WornWear posted a request for 400 kg of Wool. Batch BAT-3436 is an 84% compatible match in active inventory.",
            "timestamp": "12 mins ago",
            "read": False
        },
        {
            "id": 2,
            "type": "milestone",
            "title": "Diversion Milestone Met",
            "message": f"TexCycle has successfully diverted over {total_weight:.0f} kg of fabric waste from municipal landfills!",
            "timestamp": "1 hr ago",
            "read": False
        },
        {
            "id": 3,
            "type": "warning",
            "title": "Material Stock Accumulation",
            "message": f"Synthetic Polyester batch weight exceeds 2,000 kg. Consider routing to Chemical Recycling loops to clear inventory space.",
            "timestamp": "1 day ago",
            "read": True
        },
        {
            "id": 4,
            "type": "announcement",
            "title": "ESG Audit Factors Updated",
            "message": "Greenhouse gas offset coefficients have been updated for Cotton and Denim in compliance with verified UN SDG guidelines.",
            "timestamp": "3 days ago",
            "read": True
        }
    ]
    return notifications
