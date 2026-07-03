from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import os
import uuid

from .config import settings
from .database import engine, Base, get_db
from . import models, schemas, auth, analysis

# Define uploads folder path
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory to serve static images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Root status page
@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "TexCycle Circularity Platform",
        "version": settings.PROJECT_VERSION
    }


# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already taken
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate user
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


# --- WASTE INVENTORY ENDPOINTS ---

# Allow waste registration for: Operator, Manufacturer, Admin
can_create_waste = auth.RoleChecker(["Recycling Facility Operator", "Textile Manufacturer", "Administrator"])

@app.post("/api/inventory", response_model=schemas.WasteBatchResponse, status_code=status.HTTP_201_CREATED)
def create_waste_batch(
    batch: schemas.WasteBatchCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(can_create_waste)
):
    # Compute fallback recyclability score if manual input is missing it
    r_score = batch.recyclability_score
    if r_score is None:
        fallbacks = {
            "Cotton": 92.0, "Denim": 78.0, "Wool": 85.0, "Linen": 90.0,
            "Polyester": 35.0, "Nylon": 40.0, "Acrylic": 30.0, "Rayon": 45.0,
            "Mixed Fabrics": 22.0
        }
        r_score = fallbacks.get(batch.fabric_type, 50.0)
        
    # Calculate weighted sustainability metrics
    metrics = analysis.calculate_sustainability_metrics(
        fabric_type=batch.fabric_type,
        condition=batch.condition,
        quantity_kg=batch.quantity_kg,
        recyclability_score=r_score
    )

    db_batch = models.WasteBatch(
        fabric_type=batch.fabric_type,
        source=batch.source,
        quantity_kg=batch.quantity_kg,
        color=batch.color,
        condition=batch.condition,
        collection_date=batch.collection_date,
        image_url=batch.image_url,
        
        # Save computed metrics
        confidence_score=batch.confidence_score or 100.0, # default 100% confidence for manual entry
        recyclability_score=r_score,
        circularity_score=metrics["circularity_score"],
        co2_savings_kg=metrics["co2_savings_kg"],
        water_savings_liters=metrics["water_savings_liters"],
        recycling_strategy=metrics["recycling_strategy"],
        
        creator_id=current_user.id
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@app.get("/api/inventory", response_model=List[schemas.WasteBatchResponse])
def get_all_waste_batches(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # All authenticated users can view the inventory list
    batches = db.query(models.WasteBatch).all()
    return batches

@app.get("/api/inventory/{id}", response_model=schemas.WasteBatchResponse)
def get_waste_batch_by_id(
    id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    batch = db.query(models.WasteBatch).filter(models.WasteBatch.id == id).first()
    if not batch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waste batch not found"
        )
    return batch


# --- AI COMPUTER VISION IMAGE ANALYSIS ENDPOINT ---

@app.post("/api/inventory/analyze", status_code=status.HTTP_200_OK)
async def analyze_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(can_create_waste)
):
    # 1. Read file content
    contents = await file.read()
    
    # 2. Save file with a unique name in the uploads directory
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save image on server: {e}"
        )
        
    # 3. Analyze image using our simulated CV models
    analysis_results = analysis.analyze_textile_image(contents, file.filename)
    
    # 4. Precompute sustainability metrics (based on a reference weight of 1.0 kg for analysis step)
    metrics = analysis.calculate_sustainability_metrics(
        fabric_type=analysis_results["fabric_type"],
        condition=analysis_results["condition"],
        quantity_kg=1.0,
        recyclability_score=analysis_results["recyclability_score"]
    )
    analysis_results.update(metrics)
    
    # 5. Construct URL to serve the saved image
    image_url = f"http://localhost:8000/uploads/{unique_filename}"
    analysis_results["image_url"] = image_url
    
    return analysis_results
