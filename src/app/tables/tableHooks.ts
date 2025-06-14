import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/clients/axiosClient";
import type { Table, NewTable } from "@/types/tables";
import type { ApiResponse } from "@/types/global";

const TABLES_PATH = "/admin/tables";

export function useTables() {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Table[]>>(TABLES_PATH);
      return res.data.data;
    },
  });
}

export function useTable(id: string) {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<Table>>(`${TABLES_PATH}/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: NewTable) => {
      const res = await axiosClient.post<ApiResponse<Table>>(TABLES_PATH, { record: form });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...form }: Table & { id: string }) => {
      const res = await axiosClient.put<ApiResponse<Table>>(`${TABLES_PATH}/${id}`, { record: form });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete<ApiResponse<null>>(`${TABLES_PATH}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
