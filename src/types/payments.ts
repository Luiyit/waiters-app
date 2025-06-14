import type { Model } from '@/types/global';

// Payment types
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';

export interface NewPayment {
  orderId: string;
  method: PaymentMethod;
}

export interface Payment extends NewPayment, Model {
  amount: number;
}
