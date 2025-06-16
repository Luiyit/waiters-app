"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProductItem, useUpdateProductItem, useDeleteProductItem } from "../../orderProductHooks";
import type { NewProductItem } from "@/types/orderItems";

export default function EditProductItemPage({ params }: { params: Promise<{ orderId: string, orderItemId: string }> }) {
  const router = useRouter();
  const {orderId, orderItemId} = use(params);
  const { data: productItem, isLoading } = useProductItem(orderId, orderItemId);
  const updateProductItem = useUpdateProductItem(orderId);
  const deleteProductItem = useDeleteProductItem(orderId);
  const [form, setForm] = useState<Partial<NewProductItem>>({
    quantity: 1,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productItem) {
      setForm({
        quantity: productItem.quantity,
        notes: productItem.notes || "",
      });
    }
  }, [productItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateProductItem.mutate({ id: orderItemId, form }, {
      onSuccess: () => router.push("../../orderProducts"),
      onError: () => setError("Failed to update order product"),
    });
  };

  const handleDelete = async () => {
    setError(null);
    deleteProductItem.mutate(orderItemId, {
      onSuccess: () => router.push("../../orderProducts"),
      onError: () => setError("Failed to delete order product"),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="../../orderProducts"
          className="text-blue-600 hover:text-blue-800 text-xl mr-2"
          aria-label="Back to Order Products"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold">Edit Order Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
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
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={updateProductItem.isPending}
          >
            {updateProductItem.isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleDelete}
            disabled={deleteProductItem.isPending}
          >
            {deleteProductItem.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
} 