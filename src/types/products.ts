import type { Model } from "@/types/global";

export interface NewProduct {
  name: string;
  price: number;
  category: string;
  area: string;
  isAvailable: boolean;
}

export interface Product extends NewProduct, Model {}
