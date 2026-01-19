export type OcrResponse = {
  text: string;
  lines: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function runOcr(imageUrl: string): Promise<OcrResponse> {
  const res = await fetch(`${API_BASE_URL}/api/ocr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      detail = data?.detail ?? detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return res.json();
}


export type TranslateResponse = {
  title: string;
  short_description: string;
  highlights: string[];
  color: string;
  size: string;
  care: string;
  full_description: string;
};

export async function translateOcr(ocrText: string): Promise<TranslateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ocr_text: ocrText }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      detail = data?.detail ?? detail;
    } catch {}
    throw new Error(detail);
  }

  return res.json();
}
