"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSubProduct, useUpdateSubProduct } from "@/app/products/subProductHooks";
import type { NewSubProduct } from "@/types/subProducts";

export default function EditSubProductPage({
  params,
}: {
  params: Promise<{ id: string; subProductId: string }>;
}) {
  const router = useRouter();
  const { id: productId, subProductId } = use(params);
  const { data: subProduct, isLoading } = useSubProduct(productId, subProductId);
  const updateSubProduct = useUpdateSubProduct(productId);
  const [form, setForm] = useState<NewSubProduct>({
    name: "",
    category: "",
    price: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subProduct) {
      setForm({
        name: subProduct.name,
        category: subProduct.category,
        price: subProduct.price,
      });
    }
  }, [subProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await updateSubProduct.mutateAsync({ id: subProductId, form });
      router.push(`/products/${productId}/sub-products`);
    } catch (error) {
      console.error(error);
      setError("Failed to update sub-product");
    }
  };

  if (isLoading) return <div className="max-w-2xl mx-auto py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Sub-Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateSubProduct.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updateSubProduct.isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 