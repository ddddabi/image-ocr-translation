from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import json

from app.core.config import settings

router = APIRouter()


class TranslateRequest(BaseModel):
    ocr_text: str


class TranslateResponse(BaseModel):
    title: str
    short_description: str
    highlights: list[str]          # 3~5개
    color: str                    # 원문 기반 추정/정리
    size: str                     # 원문 기반 정리
    care: str                     # 세탁/주의사항
    full_description: str         # 무신사 글로벌 스타일 문단


@router.post("/translate", response_model=TranslateResponse)
def translate(payload: TranslateRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing in backend/.env")

    ocr_text = (payload.ocr_text or "").strip()
    if len(ocr_text) < 20:
        raise HTTPException(status_code=400, detail="ocr_text is too short")

    client = genai.Client(api_key=settings.GEMINI_API_KEY)  # :contentReference[oaicite:2]{index=2}

    schema = {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "short_description": {"type": "string"},
            "highlights": {"type": "array", "items": {"type": "string"}},
            "color": {"type": "string"},
            "size": {"type": "string"},
            "care": {"type": "string"},
            "full_description": {"type": "string"},
        },
        "required": ["title", "short_description", "highlights", "color", "size", "care", "full_description"],
    }

    system_style = """
You are a global commerce copywriter.
Turn OCR text (Korean/English mixed) from a product detail image into clean English product detail copy
similar to Musinsa Global style: short headline, key highlights, color/size, and care instructions.
Avoid hallucinating: only use info present in OCR.
If a field is missing, output an empty string for that field.
Return JSON only.
"""

    prompt = f"""
[OCR TEXT]
{ocr_text}

[OUTPUT JSON RULES]
- title: short product title in English (max 60 chars)
- short_description: 1-2 sentences, concise
- highlights: 3-5 bullet points, each <= 90 chars
- color: comma-separated color list if found
- size: size range if found
- care: washing/care instructions in English if found
- full_description: 1 short paragraph (2-4 sentences), e-commerce tone
"""

    try:
        resp = client.models.generate_content(
            model="gemini-3-flash-preview",  # docs example :contentReference[oaicite:3]{index=3}
            contents=[system_style, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",  # JSON Mode :contentReference[oaicite:4]{index=4}
                response_schema=schema,
                temperature=0.2,
            ),
        )
        data = json.loads(resp.text)
        return TranslateResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translate failed: {e}")
