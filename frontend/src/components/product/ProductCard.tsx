import type { Product } from "../../data/products";
import { useNavigate } from "react-router-dom";

type Props = { product: Product };

const FX_KRW_PER_USD = 1350; // 임시 환율 (상세 페이지와 통일 추천)

export function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  const usd = product.price / FX_KRW_PER_USD;

  return (
    <button
      className="group text-left"
      type="button"
      aria-label={product.name}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100">
        {product.badge && (
          <div className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-900">
            {product.badge}
          </div>
        )}
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-xs font-semibold text-neutral-600">{product.brand}</div>
        <div className="line-clamp-2 text-sm font-medium text-neutral-900">
          {product.name}
        </div>

        {/* ✅ USD 고정 표시 */}
        <div className="text-sm font-semibold text-neutral-900">
          ${usd.toFixed(2)} USD
        </div>
      </div>
    </button>
  );
}
