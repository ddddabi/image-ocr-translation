import { Container } from "../../components/layout/Container";
import { Header } from "../../components/layout/Header";
import { Tabs } from "../../components/ui/Tabs";
import { DetailSection } from "../../components/product/DetailSection";
import { RecommendationRow } from "../../components/product/RecommendationRow";
import { getAlsoViewed, getRecommended } from "../../lib/recommend";
import { products } from "../../data/products";
import { formatKRW } from "../../lib/format";
import { runOcr, translateOcr } from "../../lib/api";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type TabKey = "detail" | "translation" | "ocr";
type PriceView = "KRW" | "USD";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <div className="min-h-dvh bg-white">
        <Header />
        <Container>
          <div className="py-10">
            <p className="text-sm text-neutral-600">Product not found.</p>
            <button
              className="mt-4 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
              onClick={() => navigate("/")}
            >
              Back to list
            </button>
          </div>
        </Container>
      </div>
    );
  }

  // ===== UI state =====
  
  const [tab, setTab] = useState<TabKey>("detail");

  // 가격 토글 state
  const [priceView, setPriceView] = useState<PriceView>("USD");

  // 임시 환율(대충 느낌용). 나중에 API로 교체
  const FX_KRW_PER_USD = 1350;

  // 애니메이션 트리거용 (키 변경)
  const [priceAnimKey, setPriceAnimKey] = useState(0);

  const usdValue = useMemo(() => product.price / FX_KRW_PER_USD, [product.price]);
  const approxKrwFromUsd = useMemo(
    () => Math.round(usdValue * FX_KRW_PER_USD),
    [usdValue]
  );

  const mainPriceText = useMemo(() => {
    if (priceView === "KRW") return `${formatKRW(product.price)} KRW`;
    return `$${usdValue.toFixed(2)} USD`; 
  }, [priceView, product.price, usdValue]);

  const subPriceText = useMemo(() => {
    if (priceView !== "USD") return "";
    return `~${formatKRW(approxKrwFromUsd)} (환율기준)`;
  }, [priceView, approxKrwFromUsd]);

  function togglePriceView() {
    setPriceView((v) => (v === "KRW" ? "USD" : "KRW"));
    setPriceAnimKey((k) => k + 1);
  }

  // OCR 관련 state
  const [selectedDetailUrl, setSelectedDetailUrl] = useState<string>(
    product.detailImageUrls[0]
  );
  const [ocrText, setOcrText] = useState<string>("");
  const [ocrLines, setOcrLines] = useState<string[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string>("");

  const [trLoading, setTrLoading] = useState(false);
  const [trError, setTrError] = useState("");
  const [translation, setTranslation] = useState<null | {
    title: string;
    short_description: string;
    highlights: string[];
    color: string;
    size: string;
    care: string;
    full_description: string;
  }>(null);

  async function handleRunOcr() {
    try {
      setOcrError("");
      setOcrLoading(true);

      const absoluteUrl = selectedDetailUrl.startsWith("http")
        ? selectedDetailUrl
        : `${window.location.origin}${selectedDetailUrl}`;

      const data = await runOcr(absoluteUrl);

      setOcrText(data.text);
      setOcrLines(data.lines);

      // 성공하면 OCR 탭으로 이동
      setTab("ocr");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to run OCR";
      setOcrError(msg);
    } finally {
      setOcrLoading(false);
    }
  }

  async function handleGenerateTranslation() {
    try {
      setTrError("");
      setTrLoading(true);

      let sourceText = ocrText;

      // OCR 안 되어 있으면 자동 실행
      if (!sourceText) {
        const absoluteUrl = selectedDetailUrl.startsWith("http")
          ? selectedDetailUrl
          : `${window.location.origin}${selectedDetailUrl}`;

        const ocrRes = await runOcr(absoluteUrl);
        setOcrText(ocrRes.text);
        setOcrLines(ocrRes.lines);
        sourceText = ocrRes.text;
      }

      const tr = await translateOcr(sourceText);
      setTranslation(tr);
      setTab("translation");
    } catch (e) {
      setTrError(e instanceof Error ? e.message : "Failed to generate translation");
    } finally {
      setTrLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white pb-20">
      <Header />

      <main className="py-6">
        <Container>
          <button
            className="mb-4 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          {/* 상단: 대표 이미지 + 정보 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-neutral-600">{product.brand}</div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={togglePriceView}
                className="mt-3 inline-flex items-baseline gap-2 text-left"
                aria-label="Toggle currency"
                title="Click to toggle KRW / USD"
              >
                {/* 숫자만 애니메이션: key 바뀔 때마다 재마운트되어 entry 애니메이션 */}
                <span
                  key={`${priceView}-${priceAnimKey}`}
                  className={[
                    "text-lg font-semibold text-neutral-900",
                    "motion-safe:animate-[priceIn_180ms_ease-out]",
                  ].join(" ")}
                >
                  {mainPriceText}
                </span>
                <span className="text-xs font-semibold text-neutral-500">↔</span>
                {/* USD일 때만 보조표기 */}
                {priceView === "USD" && (
                  <span className="text-xs font-semibold text-neutral-500">
                    {subPriceText}
                  </span>
                )}
              </button>

              {/* 옵션 UI (MVP: 동작은 나중에) */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className="mb-2 text-xs font-semibold text-neutral-700">COLOR</div>
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-full border border-neutral-300 bg-neutral-900" />
                    <div className="h-7 w-7 rounded-full border border-neutral-300 bg-neutral-200" />
                    <div className="h-7 w-7 rounded-full border border-neutral-300 bg-neutral-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold text-neutral-700">SIZE</div>
                  <div className="flex gap-2">
                    {["S", "M", "L"].map((s) => (
                      <button
                        key={s}
                        className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                  onClick={() => setTab("detail")}
                >
                  View Detail
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold hover:bg-neutral-50"
                  onClick={() => setTab("translation")}
                >
                  View Global Translation
                </button>
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div className="mt-10">
            <Tabs value={tab} onChange={setTab} />

            {/* DETAIL */}
            {tab === "detail" && (
              <div className="mt-6">
                {/* OCR 대상 이미지 선택 + Run OCR */}
                <div className="mb-4 rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">Detail Images</div>
                      <div className="mt-1 text-xs text-neutral-600">
                        Select an image and run OCR (Korean detail image → text)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunOcr}
                      disabled={ocrLoading}
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {ocrLoading ? "Running..." : "Run OCR"}
                    </button>
                  </div>

                  {ocrError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {ocrError}
                    </div>
                  )}

                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {product.detailImageUrls.map((url) => {
                      const active = url === selectedDetailUrl;
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setSelectedDetailUrl(url)}
                          className={[
                            "relative flex-none overflow-hidden rounded-lg border",
                            active ? "border-neutral-900" : "border-neutral-200",
                          ].join(" ")}
                        >
                          <img
                            src={url}
                            alt="detail thumb"
                            className="h-20 w-20 object-cover"
                            loading="lazy"
                          />
                          {active && <div className="absolute inset-0 ring-2 ring-neutral-900" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 상세 이미지 접기/펼치기 */}
                <DetailSection imageUrls={product.detailImageUrls} collapsedHeight={720} />

                {/* 디테일 아래 추천 */}
                <div className="mt-6">
                  <RecommendationRow
                    title="You May Also Like"
                    items={getRecommended(products, product.id, 10)}
                  />
                  <RecommendationRow
                    title="People Also Viewed"
                    items={getAlsoViewed(products, product.id, 10)}
                  />
                </div>
              </div>
            )}

            {/* TRANSLATION (placeholder) */}
            {tab === "translation" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">Global Product Detail (EN)</div>
                      <div className="mt-1 text-xs text-neutral-600">
                        Generated from image-based OCR using Gemini
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateTranslation}
                      disabled={trLoading}
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {trLoading ? "Generating..." : "Generate"}
                    </button>
                  </div>

                  {trError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {trError}
                    </div>
                  )}

                  {!translation ? (
                    <div className="mt-4 text-sm text-neutral-600">
                      Click <b>Generate</b> to create a global-ready product description.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      <div>
                        <h2 className="text-lg font-bold">{translation.title}</h2>
                        <p className="mt-2 text-sm text-neutral-700">
                          {translation.short_description}
                        </p>
                      </div>

                      <div className="rounded-lg bg-neutral-50 p-4">
                        <div className="text-sm font-bold">Key Highlights</div>
                        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
                          {translation.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-bold">Color</div>
                          <div className="mt-1 text-sm">{translation.color || "-"}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-bold">Size</div>
                          <div className="mt-1 text-sm">{translation.size || "-"}</div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-bold">Care Instructions</div>
                        <p className="mt-2 text-sm">{translation.care || "-"}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-bold">Description</div>
                        <p className="mt-2 text-sm">{translation.full_description}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="text-sm font-bold">OCR Source</div>
                  <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words text-sm">
                    {ocrText || ocrLines.join("\n") || "No OCR result yet."}
                  </pre>
                </div>
              </div>
            )}


            {/* OCR RAW */}
            {tab === "ocr" && (
              <div className="mt-6">
                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">OCR Raw Text</div>
                      <div className="mt-1 text-xs text-neutral-600">
                        Source: selected detail image
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-60"
                        onClick={handleRunOcr}
                        disabled={ocrLoading}
                      >
                        {ocrLoading ? "Running..." : "Run Again"}
                      </button>

                      <button
                        type="button"
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-60"
                        onClick={() =>
                          navigator.clipboard.writeText(ocrText || ocrLines.join("\n"))
                        }
                        disabled={!ocrText && ocrLines.length === 0}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {ocrError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {ocrError}
                    </div>
                  )}

                  <pre className="mt-4 whitespace-pre-wrap break-words text-sm text-neutral-800">
                    {ocrText || (ocrLines.length ? ocrLines.join("\n") : "No OCR result yet.")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white">
        <Container>
          <div className="flex items-center gap-3 py-3">
            <button className="flex-1 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Add to Bag
            </button>
            <button className="rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold hover:bg-neutral-50">
              ♥
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
}
