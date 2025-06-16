import type { Model } from "@/types/global";

export interface NewSubProduct {
  name: string;
  price: number;
  category: string;
}

export interface SubProduct extends NewSubProduct, Model {} 