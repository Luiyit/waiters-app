import { useRouter } from 'next/navigation';
import { useEditPayment, usePayment } from '../../../paymentsHooks';
import { useState, useEffect, use } from 'react';
import { PaymentMethod } from '@/types/payments';

// Edit payment page
export default function EditPaymentPage({ params }: { params: Promise<{ orderId: string, paymentId: string }> }) {
  const { orderId, paymentId } = use(params);
  const router = useRouter();
  const { data: payment, isLoading } = usePayment(orderId, paymentId);
  const editPayment = useEditPayment(orderId, paymentId);
  const [method, setMethod] = useState<PaymentMethod>('CASH');

  useEffect(() => {
    if (payment) {
      setMethod(payment.method);
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editPayment.mutateAsync({ method });
    router.push(`/orders/${orderId}/payments`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Payment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Method:
          <select
            value={method}
            onChange={e => setMethod(e.target.value as PaymentMethod)}
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
