import type { Product } from "../../data/products";
import { formatKRW } from "../../lib/format";

type Props = {
  product: Product;
  onClick?: () => void;
};

export function ProductCard({ product, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group text-left"
      type="button"
      aria-label={`Open ${product.name}`}
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
        <div className="text-sm font-semibold text-neutral-900">
          {formatKRW(product.price)} KRW
        </div>
      </div>
    </button>
  );
}
