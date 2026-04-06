import type { Model } from "./global";

export interface NewProduct {
  name: string;
  price: number;
  category: string;
  area: string;
  isAvailable: boolean;
  isFixed: boolean;
  order: number;
}

export interface Product extends NewProduct, Model {}