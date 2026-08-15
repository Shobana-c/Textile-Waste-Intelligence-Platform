import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.api import auth, inventory, analysis, dashboard, reports, notifications

# Automatically create database tables on startup
Base.metadata.create_all(bind=engine)

# Seed default users if table is empty
db = SessionLocal()
try:
    if db.query(User).count() == 0:
        default_users = [
            User(email="operator@factory.com", full_name="Jane Operator", role="Operator", hashed_password=get_password_hash("password123")),
            User(email="manager@sustainability.org", full_name="David Manager", role="Manager", hashed_password=get_password_hash("password123")),
            User(email="brand@fashion.com", full_name="Sarah Manufacturer", role="Manufacturer", hashed_password=get_password_hash("password123")),
            User(email="admin@texcycle.com", full_name="Alex Administrator", role="Admin", hashed_password=get_password_hash("password123")),
        ]
        db.add_all(default_users)
        db.commit()

    # Seed default waste batches and analysis records if empty
    from app.models.waste import WasteBatch
    from app.models.analysis import AnalysisRecord
    import datetime

    if db.query(WasteBatch).count() == 0:
        # 1. Seed Waste Batches
        batches = [
            WasteBatch(id=1, batch_id="BAT-4701", fabric_type="Blend", source="Factory A", quantity=400.0, color="Blue", condition="Good", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=12)),
            WasteBatch(id=2, batch_id="BAT-8339", fabric_type="Blend", source="Consumer Drop", quantity=300.0, color="Green", condition="Good", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=10)),
            WasteBatch(id=3, batch_id="BAT-5740", fabric_type="Polyester", source="Sorting Hub B", quantity=2000.0, color="Black", condition="Damaged", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=8)),
            WasteBatch(id=4, batch_id="BAT-9526", fabric_type="Linen", source="Factory C", quantity=350.0, color="Red", condition="Contaminated", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=6)),
            WasteBatch(id=5, batch_id="BAT-6481", fabric_type="Nylon", source="Factory D", quantity=3400.0, color="Grey", condition="Worn", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=4)),
            WasteBatch(id=6, batch_id="BAT-3436", fabric_type="Wool", source="Sorting Hub A", quantity=5000.0, color="White", condition="Good", registered_by_id=1, collection_date=datetime.datetime.utcnow() - datetime.timedelta(days=2)),
        ]
        db.add_all(batches)
        db.commit()

        # 2. Seed corresponding Analysis Records
        analyses = [
            AnalysisRecord(
                waste_batch_id=1, fabric_type_detected="Blend", blend_details="Cotton 60%, Polyester 40%", quality_score=95.0,
                damage_detected=False, contamination_detected=False, fabric_texture="Rough / Thick Knit", fabric_pattern="Plaid",
                fabric_color="#3A6073", damage_details="None detected", contamination_details="None detected",
                recyclability_score=50.0, reuse_score=95.0, sustainability_score=55.0, material_recovery_score=40.0,
                circularity_score=64.4, waste_category="High Recovery Potential", recycling_strategy="Donation",
                co2_savings=3400.0, water_savings=1800000.0, landfill_reduction=400.0, resource_conservation=400.0
            ),
            AnalysisRecord(
                waste_batch_id=2, fabric_type_detected="Blend", blend_details="Cotton 60%, Polyester 40%", quality_score=92.0,
                damage_detected=False, contamination_detected=False, fabric_texture="Knit Pattern", fabric_pattern="Striped",
                fabric_color="#8E2DE2", damage_details="None detected", contamination_details="None detected",
                recyclability_score=52.0, reuse_score=92.0, sustainability_score=56.0, material_recovery_score=42.0,
                circularity_score=67.1, waste_category="High Recovery Potential", recycling_strategy="Upcycling",
                co2_savings=2550.0, water_savings=1350000.0, landfill_reduction=300.0, resource_conservation=300.0
            ),
            AnalysisRecord(
                waste_batch_id=3, fabric_type_detected="Polyester", blend_details="100% Polyester", quality_score=40.0,
                damage_detected=True, contamination_detected=False, fabric_texture="Smooth / Satin", fabric_pattern="Solid",
                fabric_color="#3F5EFB", damage_details="Tears detected in upper quadrant", contamination_details="None detected",
                recyclability_score=32.0, reuse_score=40.0, sustainability_score=36.0, material_recovery_score=25.0,
                circularity_score=41.1, waste_category="Moderate Recovery Potential", recycling_strategy="Disposal",
                co2_savings=7600.0, water_savings=1200000.0, landfill_reduction=2000.0, resource_conservation=2000.0
            ),
            AnalysisRecord(
                waste_batch_id=4, fabric_type_detected="Linen", blend_details="100% Linen", quality_score=15.0,
                damage_detected=False, contamination_detected=True, fabric_texture="Woven", fabric_pattern="Solid",
                fabric_color="#FC466B", damage_details="None detected", contamination_details="Organic stains detected on fabric surface",
                recyclability_score=10.0, reuse_score=15.0, sustainability_score=12.0, material_recovery_score=8.0,
                circularity_score=13.8, waste_category="Disposal Recommended", recycling_strategy="Upcycling",
                co2_savings=2975.0, water_savings=1575000.0, landfill_reduction=350.0, resource_conservation=350.0
            ),
            AnalysisRecord(
                waste_batch_id=5, fabric_type_detected="Nylon", blend_details="100% Nylon", quality_score=70.0,
                damage_detected=False, contamination_detected=False, fabric_texture="Woven", fabric_pattern="Solid",
                fabric_color="#C0C0C0", damage_details="None detected", contamination_details="None detected",
                recyclability_score=56.0, reuse_score=70.0, sustainability_score=58.0, material_recovery_score=45.0,
                circularity_score=63.3, waste_category="High Recovery Potential", recycling_strategy="Disposal",
                co2_savings=12920.0, water_savings=2040000.0, landfill_reduction=3400.0, resource_conservation=3400.0
            ),
            AnalysisRecord(
                waste_batch_id=6, fabric_type_detected="Wool", blend_details="100% Wool", quality_score=95.0,
                damage_detected=False, contamination_detected=False, fabric_texture="Rough / Thick Knit", fabric_pattern="Solid",
                fabric_color="#FF007F", damage_details="None detected", contamination_details="None detected",
                recyclability_score=85.0, reuse_score=95.0, sustainability_score=80.0, material_recovery_score=72.0,
                circularity_score=83.1, waste_category="Excellent Recovery Potential", recycling_strategy="Upcycling",
                co2_savings=45000.0, water_savings=10000000.0, landfill_reduction=5000.0, resource_conservation=5000.0
            )
        ]
        db.add_all(analyses)
        db.commit()
    
    db.close()
finally:
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configurations
# Allow standard localhost development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serves Uploads folder statically for image previews on frontend
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(inventory.router, prefix=f"{settings.API_V1_STR}/inventory", tags=["Waste Inventory"])
app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}/analysis", tags=["Image Analysis & CV"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard Aggregations"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reporting & Export"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notification & Alert System"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }
