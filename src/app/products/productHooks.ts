import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { Product, NewProduct } from "@/types/products";
import type { ApiResponse } from "@/types/global";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Product[]>>("/products");
      return res.data.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewProduct) => {
      const res = await axiosClient.post<ApiResponse<Product>>("/products", form);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete<ApiResponse<null>>(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: NewProduct }) => {
      await axiosClient.put(`/products/${id}`, form);
    },
    onSuccess: (_data: unknown, variables: { id: string; form: NewProduct }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}
