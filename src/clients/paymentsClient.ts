import axios from './axiosClient';
import { NewPayment, Payment } from '../types/payments';

export async function fetchPayments(orderId: string): Promise<Payment[]> {
  const res = await axios.get(`/orders/${orderId}/payments`);
  return res.data;
}

export async function createPayment(orderId: string, payment: NewPayment): Promise<Payment> {
  const res = await axios.post(`/orders/${orderId}/payments`, {record: payment});
  return res.data;
}

export async function updatePayment(orderId: string, paymentId: string, payment: Partial<Payment>): Promise<Payment> {
  const res = await axios.put(`/orders/${orderId}/payments/${paymentId}`, payment);
  return res.data;
}

export async function fetchPayment(orderId: string, paymentId: string): Promise<Payment> {
  const res = await axios.get(`/orders/${orderId}/payments/${paymentId}`);
  return res.data;
}
