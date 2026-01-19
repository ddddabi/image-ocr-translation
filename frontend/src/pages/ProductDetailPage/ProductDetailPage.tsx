import { Container } from "../../components/layout/Container";
import { Header } from "../../components/layout/Header";
import { Tabs } from "../../components/ui/Tabs";
import { DetailSection } from "../../components/product/DetailSection";
import { RecommendationRow } from "../../components/product/RecommendationRow";
import { getAlsoViewed, getRecommended } from "../../lib/recommend";
import { products } from "../../data/products";
import { formatKRW } from "../../lib/format";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type TabKey = "detail" | "translation" | "ocr";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  const [tab, setTab] = useState<TabKey>("detail");

  // MVP: 아직 백엔드 연결 전이라 더미
  const [ocrText] = useState<string>(
    "OCR 결과가 여기에 표시됩니다.\n(다음 단계에서 Run OCR로 채울 예정)"
  );
  const [translation] = useState({
    summary_3: [
      "English summary line 1...",
      "English summary line 2...",
      "English summary line 3...",
    ],
    bullets_5: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    care: "Care note will appear here.",
  });

  if (!product) {
    return (
      <div className="min-h-dvh bg-white">
        <Header />
        <Container>
          <div className="py-10">
            <p className="text-sm text-neutral-600">Product not found.</p>
            <button
              className="mt-4 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold"
              onClick={() => navigate("/")}
            >
              Back to list
            </button>
          </div>
        </Container>
      </div>
    );
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

          {/* 상단: 이미지 + 정보 */}
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
              <div className="mt-3 text-lg font-semibold">
                {formatKRW(product.price)} KRW
              </div>

              {/* 옵션 UI (동작은 나중에) */}
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

            {tab === "detail" && (
              <div className="mt-6">
                <DetailSection imageUrls={product.detailImageUrls} collapsedHeight={560} />
                <RecommendationRow
                  title="You May Also Like"
                  items={getRecommended(products, product.id, 10)}
                />
                <RecommendationRow
                  title="People Also Viewed"
                  items={getAlsoViewed(products, product.id, 10)}
                />
              </div>
            )}

            {tab === "translation" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="text-sm font-bold">English Summary</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-800">
                    {translation.summary_3.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="text-sm font-bold">Key Features</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-800">
                    {translation.bullets_5.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="text-sm font-bold">Care Note</div>
                  <p className="mt-3 text-sm text-neutral-800">{translation.care}</p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(translation, null, 2))}
                >
                  Copy translation JSON
                </button>
              </div>
            )}

            {tab === "ocr" && (
              <div className="mt-6">
                <div className="rounded-xl border border-neutral-200 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">OCR Raw Text</div>
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                      onClick={() => navigator.clipboard.writeText(ocrText)}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="mt-4 whitespace-pre-wrap break-words text-sm text-neutral-800">
                    {ocrText}
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
