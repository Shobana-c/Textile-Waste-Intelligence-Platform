import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Textile Waste Intelligence Platform"
    
    # JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyforjwttokengenerationtextilewasteplatform")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Default to local SQLite file database. If POSTGRES_USER is set, use PostgreSQL.
    SQLITE_DB_FILE: str = "textile_waste.db"
    
    @property
    def DATABASE_URL(self) -> str:
        postgres_user = os.getenv("POSTGRES_USER")
        postgres_password = os.getenv("POSTGRES_PASSWORD")
        postgres_host = os.getenv("POSTGRES_HOST", "localhost")
        postgres_port = os.getenv("POSTGRES_PORT", "5432")
        postgres_db = os.getenv("POSTGRES_DB", "textile_waste")
        
        if postgres_user:
            return f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"
        return f"sqlite:///./{self.SQLITE_DB_FILE}"

    class Config:
        case_sensitive = True

settings = Settings()
