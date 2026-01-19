import { Header } from "../../components/layout/Header";
import { Container } from "../../components/layout/Container";
import { products } from "../../data/products";
import { ProductGrid } from "../../components/product/ProductGrid";

export default function ProductListPage() {
  return (
    <div className="min-h-dvh bg-white">
      <Header />

      <main className="py-6">
        <Container>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight">New In</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Musinsa-inspired list demo (OCR → EN translation coming next)
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                Filter
              </button>
              <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                Sort
              </button>
            </div>
          </div>

          <div className="mt-6">
            <ProductGrid products={products} />
          </div>
        </Container>
      </main>
    </div>
  );
}
