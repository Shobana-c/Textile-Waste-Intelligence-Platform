import os

class Settings:
    PROJECT_NAME: str = "Textile Waste Intelligence Platform"
    PROJECT_VERSION: str = "1.0.0"
    
    # JWT authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "textile-waste-platform-secret-key-super-secure-token-999")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours for easy development testing
    
    # SQLite Database connection
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./textile_waste.db")

settings = Settings()
