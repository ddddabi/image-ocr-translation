import type { Product } from "../../data/products";
import { formatKRW } from "../../lib/format";
import { useNavigate } from "react-router-dom";

export function RecommendationRow({
  title,
  items,
  onViewMore,
}: {
  title: string;
  items: Product[];
  onViewMore?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <section className="py-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={onViewMore}
          className="text-sm font-semibold text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
        >
          View More
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p) => (
            <button
              key={p.id}
              type="button"
              className="w-[200px] flex-none text-left"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
                <img src={p.thumbnailUrl} alt={p.name} className="h-full w-full object-cover" />
              </div>

              <div className="mt-3">
                <div className="text-xs font-bold">{p.brand}</div>
                <div className="mt-1 line-clamp-2 text-sm text-neutral-800">{p.name}</div>
                <div className="mt-2 text-sm font-semibold">{formatKRW(p.price)} KRW</div>

                {/* MVP용: 하트/리뷰는 더미로 */}
                <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                  <span>♡</span>
                  <span>{Math.floor(100 + Math.random() * 5000).toLocaleString()}</span>
                  <span>★</span>
                  <span>{(4 + Math.random()).toFixed(1)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 오른쪽 페이드(스크롤 유도) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-white/0" />
      </div>
    </section>
  );
}
