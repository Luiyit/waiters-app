"use client";
import React, { use, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCreateProductItem } from "../orderItemHooks";
import { useProducts } from "@/app/products/productHooks";
import type { NewProductItem } from "@/types/orderItems";
import Link from "next/link";

export default function CreateProductItemPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { orderId } = use(params);
  const createProductItem = useCreateProductItem(orderId);
  const { data: products, isLoading } = useProducts();
  const [form, setForm] = useState<NewProductItem>({
    productId: "",
    quantity: 1,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createProductItem.mutate(form, {
      onSuccess: () => router.push("../orderItems"),
      onError: () => setError("Failed to create order item"),
    });
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href={"../orderItems"}
          className="text-blue-600 hover:text-blue-800 text-xl mr-2"
          aria-label="Back to Order Items"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold">Add Order Item</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={isLoading}
          >
            <option value="">Select product</option>
            {products && products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="quantity"
            type="number"
            min={1}
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
