import type { Product } from "../../data/products";
import { ProductCard } from "../product/ProductCard";

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onClick={() => {
            // 상세 페이지는 다음 단계에서 라우팅 붙일 것
            alert(`Open product: ${p.id}`);
          }}
        />
      ))}
    </div>
  );
}
