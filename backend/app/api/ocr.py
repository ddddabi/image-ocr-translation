from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import uuid
import time
import json
from urllib.parse import urlparse

from app.core.config import settings

router = APIRouter()


# ===== Schemas =====
class OCRRequest(BaseModel):
    image_url: str


class OCRResponse(BaseModel):
    text: str
    lines: list[str]


# ===== Helpers =====
def detect_image_format(url: str) -> str:
    url = url.lower()
    if url.endswith(".png"):
        return "png"
    if url.endswith(".jpg") or url.endswith(".jpeg"):
        return "jpg"
    return "png"  # default


# ===== Endpoint =====
@router.post("/ocr", response_model=OCRResponse)
async def run_ocr(payload: OCRRequest):
    image_url = payload.image_url

    # --- basic validation ---
    if not image_url.startswith("http://") and not image_url.startswith("https://"):
        raise HTTPException(status_code=400, detail="image_url must start with http:// or https://")

    # ======================================================
    # 1) Download image (from frontend public assets)
    # ======================================================
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            img_res = await client.get(image_url, follow_redirects=True)
            img_res.raise_for_status()
            image_bytes = img_res.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image: {e}")

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Downloaded image is empty")

    # ======================================================
    # 2) Prepare Clova OCR request
    # ======================================================
    if not settings.CLOVA_OCR_INVOKE_URL.startswith("http"):
        raise HTTPException(
            status_code=500,
            detail="CLOVA_OCR_INVOKE_URL is invalid (must start with https://)",
        )

    image_format = detect_image_format(image_url)

    request_body = {
        "version": "V2",
        "requestId": str(uuid.uuid4()),
        "timestamp": int(time.time() * 1000),
        "images": [
            {
                "format": image_format,
                "name": "detail-image",
            }
        ],
    }

    headers = {
        "X-OCR-SECRET": settings.CLOVA_OCR_SECRET,
    }

    files = {
        "file": (f"image.{image_format}", image_bytes, f"image/{image_format}"),
        "message": (None, json.dumps(request_body), "application/json"),
    }

    # ======================================================
    # 3) Call Clova OCR
    # ======================================================
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            res = await client.post(
                settings.CLOVA_OCR_INVOKE_URL,
                headers=headers,
                files=files,
            )
            # ✅ 400/403일 때 body까지 확인
            if res.status_code >= 400:
                raise HTTPException(
                    status_code=500,
                    detail=f"Clova OCR error {res.status_code}: {res.text}",
                )
            ocr_result = res.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR request failed: {e}")


    # ======================================================
    # 4) Parse result
    # ======================================================
    images = ocr_result.get("images", [])
    if not images:
        return OCRResponse(text="", lines=[])

    fields = images[0].get("fields", [])
    lines = [f["inferText"] for f in fields if "inferText" in f]
    full_text = "\n".join(lines)

    return OCRResponse(
        text=full_text,
        lines=lines,
    )
