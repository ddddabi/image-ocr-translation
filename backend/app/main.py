from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.translate import router as translate_router


from app.core.config import settings
from app.api.ocr import router as ocr_router

app = FastAPI(title="musinsa-image-ocr-translation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(ocr_router, prefix="/api", tags=["ocr"])
app.include_router(translate_router, prefix="/api", tags=["translate"])
