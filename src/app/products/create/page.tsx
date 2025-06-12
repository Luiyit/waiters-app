"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/clients/axiosClient";
import type { Product, NewProduct } from "@/types/products";
import type { ApiResponse } from "@/types/global";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<NewProduct>({
    name: "",
    price: 0,
    category: "",
    area: "",
    isAvailable: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post<ApiResponse<Product>>("/products", form);
      router.push("/products");
    } catch {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Area</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Available</label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => router.push("/products")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
