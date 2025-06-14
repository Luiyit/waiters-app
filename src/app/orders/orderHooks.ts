import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { ApiResponse } from "@/types/global";
import type { Order, NewOrder } from "@/types/orders";
import type { Table } from "@/types/tables";

const ORDERS_PATH = "/orders";
const TABLES_PATH = "/admin/tables";

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Table[]>>(TABLES_PATH);
      return res.data.data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewOrder) => {
      const res = await axiosClient.post<ApiResponse<Order>>(ORDERS_PATH, { record: form });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Order>>(`${ORDERS_PATH}/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: NewOrder }) => {
      await axiosClient.put(`${ORDERS_PATH}/${id}`, { record: form });
    },
    onSuccess: (_data: unknown, variables: { id: string; form: NewOrder }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Order[]>>(ORDERS_PATH);
      return res.data.data;
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`${ORDERS_PATH}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
