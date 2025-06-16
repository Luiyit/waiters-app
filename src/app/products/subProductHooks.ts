import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { SubProduct, NewSubProduct } from "@/types/subProducts";
import type { ApiResponse } from "@/types/global";

const SUB_PRODUCTS_PATH = "/admin/sub-products";

export function useSubProducts(productId: string) {
  return useQuery({
    queryKey: ["sub-products", productId],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<SubProduct[]>>(`/admin/products/${productId}/sub-products`);
      return res.data.data;
    },
    enabled: !!productId,
  });
}

export function useCreateSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewSubProduct) => {
      const res = await axiosClient.post<ApiResponse<SubProduct>>(
        `/admin/products/${productId}/sub-products`,
        { record: form }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
}

export function useUpdateSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: NewSubProduct }) => {
      await axiosClient.put(`/admin/products/${productId}/sub-products/${id}`, { record: form });
    },
    onSuccess: (_data: unknown, variables: { id: string; form: NewSubProduct }) => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
}

export function useDeleteSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subProductId: string) => {
      await axiosClient.delete<ApiResponse<null>>(`/admin/products/${productId}/sub-products/${subProductId}/unlink`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
}

export function useSubProduct(productId: string, subProductId: string) {
  return useQuery({
    queryKey: ["sub-product", productId, subProductId],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<SubProduct>>(
        `/admin/products/${productId}/sub-products/${subProductId}`
      );
      return res.data.data;
    },
    enabled: !!productId && !!subProductId,
  });
}

export function useSearchSubProducts(query?: string) {
  return useQuery({
    queryKey: ["sub-products-search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await axiosClient.get<ApiResponse<SubProduct[]>>(`/admin/sub-products/search`, {
        params: { q: query }
      });
      return res.data.data;
    },
    enabled: !!query && query.length >= 2,
  });
}

export function useLinkSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subProductId: string) => {
      await axiosClient.post<ApiResponse<null>>(
        `/admin/products/${productId}/sub-products/${subProductId}/link`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
} 