export type ProductItem = {
  id: string;
  productId: string;
  orderId?: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewProductItem = {
  productId: string;
  quantity: number;
  notes?: string;
};
