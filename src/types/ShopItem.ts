// src/types/ShopItem.ts

export interface ShopItem {
  id: number;
  type: "banner" | "cardWithImage" | "cardWithoutImage";
  image?: string;
  title?: string;
  miniDescription?: string;
  detailedDescription?: string;
  detailedMiniDescription?: string;
  price?: number;
  discountPercentage?: number;
  category?: string;
  backgroundColor?: string;
}