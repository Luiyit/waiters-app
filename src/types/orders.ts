import type { Model } from "@/types/global";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SERVED = "SERVED",
  CANCELED = "CANCELED"
}

export interface NewOrder {
  tableId: string;
}

export interface Order extends NewOrder, Model {
  status: OrderStatus;
}
