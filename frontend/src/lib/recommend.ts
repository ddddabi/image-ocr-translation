import type { Product } from "../data/products";

export function getRecommended(products: Product[], currentId: string, limit = 8) {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}

export function getAlsoViewed(products: Product[], currentId: string, limit = 8) {
  // MVP: 같은 로직으로 재사용 (나중에 다른 로직으로 교체 가능)
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}
