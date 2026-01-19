import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Settings(BaseModel):
    CLOVA_OCR_SECRET: str = os.getenv("CLOVA_OCR_SECRET", "")
    CLOVA_OCR_INVOKE_URL: str = os.getenv("CLOVA_OCR_INVOKE_URL", "")
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5174")

settings = Settings()
