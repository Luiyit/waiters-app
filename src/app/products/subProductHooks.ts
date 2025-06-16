import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { SubProduct, NewSubProduct } from "@/types/subProducts";
import type { ApiResponse } from "@/types/global";

const SUB_PRODUCTS_PATH = "/admin/products/:productId/sub-products";
const SUB_PRODUCT_PATH = "/admin/products/:productId/sub-products/:subProductId";
const SUB_PRODUCTS_SEARCH_PATH = "/admin/sub-products/search";

export function useSubProducts(productId: string) {
  return useQuery({
    queryKey: ["sub-products", productId],
    queryFn: async () => {
      const path = SUB_PRODUCTS_PATH.replace(":productId", productId);
      const res = await axiosClient.get<ApiResponse<SubProduct[]>>(path);
      return res.data.data;
    },
    enabled: !!productId,
  });
}

export function useCreateSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewSubProduct) => {
      const path = SUB_PRODUCTS_PATH.replace(":productId", productId);
      const res = await axiosClient.post<ApiResponse<SubProduct>>(path, { record: form });
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
      const path = SUB_PRODUCT_PATH
        .replace(":productId", productId)
        .replace(":subProductId", id);
      await axiosClient.put(path, { record: form });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
}

export function useDeleteSubProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subProductId: string) => {
      const path = SUB_PRODUCT_PATH
        .replace(":productId", productId)
        .replace(":subProductId", subProductId);
      await axiosClient.delete<ApiResponse<null>>(`${path}/unlink`);
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
      const path = SUB_PRODUCT_PATH
        .replace(":productId", productId)
        .replace(":subProductId", subProductId);
      const res = await axiosClient.get<ApiResponse<SubProduct>>(path);
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
      const res = await axiosClient.get<ApiResponse<SubProduct[]>>(SUB_PRODUCTS_SEARCH_PATH, {
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
      const path = SUB_PRODUCT_PATH
        .replace(":productId", productId)
        .replace(":subProductId", subProductId);
      await axiosClient.post<ApiResponse<null>>(`${path}/link`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-products", productId] });
    },
  });
} 