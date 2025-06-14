"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePayment } from "../../../paymentsHooks";
import { PaymentMethod } from "@/types/payments";

export default function CreatePaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const createPayment = useCreatePayment(orderId);
  const [form, setForm] = useState<{ method: PaymentMethod }>({ method: "CASH" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, method: e.target.value as PaymentMethod }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createPayment.mutate(
      { orderId, method: form.method },
      {
        onSuccess: () => router.push(`/orders`),
        onError: () => setError("Failed to create payment"),
      }
    );
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Method</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={createPayment.isPending}
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="TRANSFER">Transfer</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={createPayment.isPending}
        >
          {createPayment.isPending ? "Creating..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
}
