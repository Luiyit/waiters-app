import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { ApiResponse } from "@/types/global";
import type { ProductItem, NewProductItem } from "@/types/orderItems";

const ORDER_ITEMS_PATH = "/orders/:orderId/product-items";

export function useProductItems(orderId: string) {
  return useQuery<ProductItem[]>({
    queryKey: ["productItems", orderId],
    queryFn: async () => {
      const url = ORDER_ITEMS_PATH.replace(":orderId", orderId);
      const res = await axiosClient.get<ApiResponse<ProductItem[]>>(url);
      return res.data.data;
    },
    enabled: !!orderId,
  });
}

export function useCreateProductItem(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewProductItem) => {
      const url = ORDER_ITEMS_PATH.replace(":orderId", orderId);
      const res = await axiosClient.post<ApiResponse<ProductItem>>(url, { record: form });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productItems", orderId] });
    },
  });
}

export function useProductItem(orderId: string, id: string) {
  return useQuery({
    queryKey: ["productItem", orderId, id],
    queryFn: async () => {
      const url = ORDER_ITEMS_PATH.replace(":orderId", orderId) + `/${id}`;
      const res = await axiosClient.get<ApiResponse<ProductItem>>(url);
      return res.data.data;
    },
    enabled: !!orderId && !!id,
  });
}

export function useUpdateProductItem(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<NewProductItem> }) => {
      const url = ORDER_ITEMS_PATH.replace(":orderId", orderId) + `/${id}`;
      await axiosClient.put(url, { record: form });
    },
    onSuccess: (_data: unknown, variables: { id: string; form: Partial<NewProductItem> }) => {
      queryClient.invalidateQueries({ queryKey: ["productItems", orderId] });
      queryClient.invalidateQueries({ queryKey: ["productItem", orderId, variables.id] });
    },
  });
}

export function useDeleteProductItem(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = ORDER_ITEMS_PATH.replace(":orderId", orderId) + `/${id}`;
      await axiosClient.delete(url);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productItems", orderId] });
      queryClient.invalidateQueries({ queryKey: ["productItem", orderId, id] });
    },
  });
}
