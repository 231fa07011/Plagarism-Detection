from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Plagiarism Detection"
    DATABASE_URL: str = "postgresql://user:password@localhost/plagiarism_db"
    SECRET_KEY: str = "supersecretkey"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # NLP Settings
    NLP_MODEL_NAME: str = "all-MiniLM-L6-v2"  # Lightweight and fast
    SIMILARITY_THRESHOLD_EXACT: float = 0.95
    SIMILARITY_THRESHOLD_PARA: float = 0.70
    
    # Copyleaks API
    COPYLEAKS_EMAIL: str = "your-email@example.com"
    COPYLEAKS_API_KEY: str = "your-api-key"


    class Config:
        case_sensitive = True

settings = Settings()
