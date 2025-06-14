"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrder, useTables } from "../orderHooks";
import type { NewOrder } from "@/types/orders";

export default function CreateOrderPage() {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const { data: tables, isLoading } = useTables();
  const [form, setForm] = useState<NewOrder>({
    tableId: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, tableId: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createOrder.mutate(form, {
      onSuccess: () => router.push("/orders"),
      onError: () => setError("Failed to create order"),
    });
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Table</label>
          <select
            name="tableId"
            value={form.tableId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={isLoading}
          >
            <option value="">Select table</option>
            {tables && tables.map((table) => (
              <option key={table.id} value={table.id}>{table.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}
