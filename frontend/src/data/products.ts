export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  badge?: "NEW" | "SALE";
  detailImageUrls: string[];
};

export const products: Product[] = [
  {
    id: "p001",
    brand: "LEMAIN SECOND",
    name: "Overfit volume washable half zip-up cable knit [gray]",
    price: 59000,
    thumbnailUrl: "/assets/p001.png",
    badge: "NEW",
    detailImageUrls: ["/assets/p001_detail_1.png", "/assets/p001_detail_2.png","/assets/p001_detail_3.png", "/assets/p001_detail_4.png"],
  },
  {
    id: "p002",
    brand: "TRAVEL",
    name: "[3-PACK] BASIC TRAVELER PIGMENT SWEATSHIRT",
    price: 29900,
    thumbnailUrl: "/assets/p002.png",
    detailImageUrls: ["/assets/p002_detail_1.png"],
  },
  {
    id: "p003",
    brand: "LIKE THE MOST",
    name: "Essential Peach Skin Balloon Over Hoodie 5colors",
    price: 189000,
    thumbnailUrl: "/assets/p003.png",
    badge: "SALE",
    detailImageUrls: ["/assets/p003_detail_1.png","/assets/p003_detail_2.png"],
  },
  {
    id: "p004",
    brand: "GAKKAI UNIONS",
    name: "SINGLE PLEATED WIDE SWEATPANTS GRAY",
    price: 49000,
    thumbnailUrl: "/assets/p004.png",
    detailImageUrls: ["/assets/p004_detail_1.png","/assets/p004_detail_2.png"],
  },
];
