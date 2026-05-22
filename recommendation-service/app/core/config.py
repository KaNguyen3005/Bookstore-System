import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "KaTiLa AI Recommender"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    COLLAB_WEIGHT: float = float(os.getenv("COLLAB_WEIGHT", "0.6"))
    CONTENT_WEIGHT: float = float(os.getenv("CONTENT_WEIGHT", "0.4"))

settings = Settings()
