import { fetchPayments, createPayment, updatePayment, fetchPayment } from '../../clients/paymentsClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewPayment, Payment } from '../../types/payments';

export function usePayments(orderId: string) {
  return useQuery<Payment[]>({
    queryKey: ['payments', orderId],
    queryFn: () => fetchPayments(orderId),
    enabled: !!orderId,
  });
}

export function useCreatePayment(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: NewPayment) => createPayment(orderId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', orderId] });
    },
  });
}

export function useEditPayment(orderId: string, paymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Partial<Payment>) => updatePayment(orderId, paymentId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', orderId] });
    },
  });
}

export function usePayment(orderId: string, paymentId: string) {
  return useQuery<Payment>({
    queryKey: ['payment', orderId, paymentId],
    queryFn: () => fetchPayment(orderId, paymentId),
    enabled: !!orderId && !!paymentId,
  });
}
