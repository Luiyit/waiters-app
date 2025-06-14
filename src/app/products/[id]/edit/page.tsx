"use client";
import React, { use, useEffect, useState } from "react";
import { useProduct, useUpdateProduct } from "@/app/products/productHooks";
import { useRouter } from "next/navigation";
import type { NewProduct } from "@/types/products";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data, isLoading, error: fetchError } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const [form, setForm] = useState<NewProduct>({
    name: "",
    price: 0,
    category: "",
    area: "",
    isAvailable: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const { name, price, category, area, isAvailable } = data;
      setForm({ name, price, category, area, isAvailable });
    }
  }, [data]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateProduct.mutate(
      { id, form },
      {
        onSuccess: () => router.push("/products"),
        onError: () => setError("Failed to update product"),
      }
    );
  };

  if (isLoading) return <div className="max-w-xl mx-auto py-8">Loading...</div>;
  if (fetchError) return <div className="max-w-xl mx-auto py-8 text-red-500">Failed to load product</div>;
  const loading = updateProduct.isPending;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
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
            {loading ? "Saving..." : "Save"}
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
