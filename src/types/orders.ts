import type { Model } from "@/types/global";

export interface NewOrder {
  tableId: string;
}

export interface Order extends NewOrder, Model {}
