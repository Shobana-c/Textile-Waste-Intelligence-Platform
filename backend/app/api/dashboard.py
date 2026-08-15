from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.core.database import get_db
from app.api.auth import get_current_active_user
from app.models.user import User
from app.models.waste import WasteBatch
from app.models.analysis import AnalysisRecord

router = APIRouter()

@router.get("/stats")
def get_dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Returns aggregated system stats for dashboards:
    - Overview metrics (Total batches, weight, carbon savings, water savings)
    - Fabric distribution (Cotton, Polyester, etc.)
    - Circularity category breakdown
    - Time-series monthly volume (mocked/simulated based on actual database dates)
    """
    # 1. Base counts
    total_batches = db.query(WasteBatch).count()
    total_weight = db.query(func.sum(WasteBatch.quantity)).scalar() or 0.0
    total_weight = round(total_weight, 1)

    # 2. Environmental Impact totals
    total_co2 = db.query(func.sum(AnalysisRecord.co2_savings)).scalar() or 0.0
    total_water = db.query(func.sum(AnalysisRecord.water_savings)).scalar() or 0.0
    total_landfill = db.query(func.sum(AnalysisRecord.landfill_reduction)).scalar() or 0.0
    total_resources = db.query(func.sum(AnalysisRecord.resource_conservation)).scalar() or 0.0

    # 3. Fabric Type Distribution
    fabric_stats = db.query(
        WasteBatch.fabric_type, 
        func.count(WasteBatch.id).label("count"),
        func.sum(WasteBatch.quantity).label("weight")
    ).group_by(WasteBatch.fabric_type).all()
    
    fabric_distribution = [
        {"fabric_type": row[0], "count": row[1], "weight": round(row[2] or 0.0, 1)}
        for row in fabric_stats
    ]

    # 4. Circularity Category Distribution
    circularity_stats = db.query(
        AnalysisRecord.waste_category,
        func.count(AnalysisRecord.id).label("count")
    ).group_by(AnalysisRecord.waste_category).all()
    
    circularity_distribution = [
        {"category": row[0] or "Unassigned", "count": row[1]}
        for row in circularity_stats
    ]

    # 5. Recovery Strategy Distribution
    strategy_stats = db.query(
        AnalysisRecord.recycling_strategy,
        func.count(AnalysisRecord.id).label("count")
    ).group_by(AnalysisRecord.recycling_strategy).all()
    
    strategy_distribution = [
        {"strategy": row[0] or "Unassigned", "count": row[1]}
        for row in strategy_stats
    ]

    # 6. Monthly collections data (last 6 months)
    # Group by collection date month
    monthly_stats = db.query(
        func.strftime("%Y-%m", WasteBatch.collection_date).label("month"),
        func.sum(WasteBatch.quantity).label("weight"),
        func.count(WasteBatch.id).label("count")
    ).group_by("month").order_by("month").limit(6).all()
    
    monthly_trends = [
        {"month": row[0], "weight": round(row[1] or 0.0, 1), "count": row[2]}
        for row in monthly_stats
    ]
    
    # Fallback to defaults if no history exists yet to bootstrap charts
    if not monthly_trends:
        monthly_trends = [
            {"month": "2026-02", "weight": 420.0, "count": 12},
            {"month": "2026-03", "weight": 680.0, "count": 18},
            {"month": "2026-04", "weight": 510.0, "count": 15},
            {"month": "2026-05", "weight": 890.0, "count": 22},
            {"month": "2026-06", "weight": 1100.0, "count": 27},
            {"month": "2026-07", "weight": total_weight, "count": total_batches}
        ]

    # 7. Quality ratings
    avg_quality = db.query(func.avg(AnalysisRecord.quality_score)).scalar() or 0.0
    avg_circularity = db.query(func.avg(AnalysisRecord.circularity_score)).scalar() or 0.0

    return {
        "summary": {
            "total_batches": total_batches,
            "total_weight": total_weight,
            "total_co2_savings": round(total_co2, 1),
            "total_water_savings": round(total_water, 1),
            "total_landfill_reduction": round(total_landfill, 1),
            "total_resource_conservation": round(total_resources, 1),
            "average_quality_score": round(avg_quality, 1),
            "average_circularity_score": round(avg_circularity, 1)
        },
        "fabric_distribution": fabric_distribution,
        "circularity_distribution": circularity_distribution,
        "strategy_distribution": strategy_distribution,
        "monthly_trends": monthly_trends,
        "user": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role
        }
    }
