import { Container } from "./Container";
import { IoBagHandleOutline, IoPersonOutline, IoSearch } from "react-icons/io5";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex h-14 items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-lg font-black tracking-tight">MUSINSA</div>
            <div className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
              GLOBAL
            </div>
          </div>

          <div className="ml-auto hidden w-full max-w-md md:block">
            <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
              <span className="text-neutral-400">⌕</span>
              <span>Search products</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Search">
              <IoSearch/>
            </button>
            <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Account">
              <IoPersonOutline/>
            </button>
            <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Cart">
              <IoBagHandleOutline />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
