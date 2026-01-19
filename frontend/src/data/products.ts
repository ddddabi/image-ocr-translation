export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  badge?: "NEW" | "SALE";
};

export const products: Product[] = [
  {
    id: "p001",
    brand: "LEMAIN SECOND",
    name: "Overfit volume washable half zip-up cable knit [gray]",
    price: 59000,
    thumbnailUrl: "/assets/p001.png",
    badge: "NEW",
  },
  {
    id: "p002",
    brand: "TRAVEL",
    name: "[3-PACK] BASIC TRAVELER PIGMENT SWEATSHIRT",
    price: 29900,
    thumbnailUrl: "/assets/p002.png",
  },
  {
    id: "p003",
    brand: "LIKE THE MOST",
    name: "Essential Peach Skin Balloon Over Hoodie 5colors",
    price: 189000,
    thumbnailUrl: "/assets/p003.png",
    badge: "SALE",
  },
  {
    id: "p004",
    brand: "GAKKAI UNIONS",
    name: "SINGLE PLEATED WIDE SWEATPANTS GRAY",
    price: 49000,
    thumbnailUrl: "/assets/p004.png",
  },
];
