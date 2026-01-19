import { useMemo, useState } from "react";

export function DetailSection({
  imageUrls,
  collapsedHeight = 720, // ✅ 더 크게: 처음에 조금 더 보여주기
}: {
  imageUrls: string[];
  collapsedHeight?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const containerStyle = useMemo(() => {
    if (expanded) return undefined;
    return { maxHeight: collapsedHeight };
  }, [expanded, collapsedHeight]);

  return (
    <section className="relative">
      {/* 이미지 영역 */}
      <div
        className={[
          "relative overflow-hidden transition-[max-height] duration-300 ease-in-out",
          expanded ? "max-h-none" : "",
        ].join(" ")}
        style={containerStyle as React.CSSProperties}
      >
        <div className="space-y-4">
          {imageUrls.map((url) => (
            <div key={url} className="overflow-hidden rounded-xl bg-neutral-100">
              <img src={url} alt="detail" className="w-full" loading="lazy" />
            </div>
          ))}
        </div>

        {/* ✅ 접힌 상태에서만: 하단 페이드 (버튼 위로만 덮게) */}
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/90 to-white/0" />
        )}

        {/* ✅ 버튼을 이미지 영역 안에 overlay로 배치 */}
        {!expanded && (
          <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="pointer-events-auto inline-flex w-full max-w-md items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Show More
              <span className="transition-transform">▾</span>
            </button>
          </div>
        )}
      </div>

      {/* ✅ 펼친 상태에서만: 아래에 접기 버튼 */}
      {expanded && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Show Less
            <span className="rotate-180 transition-transform">▾</span>
          </button>
        </div>
      )}
    </section>
  );
}
