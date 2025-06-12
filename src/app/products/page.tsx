"use client";
import React, { useEffect, useState } from "react";
import axiosClient from "@/clients/axiosClient";
import Link from "next/link";
import type { Product } from "@/types/products";
import type { ApiResponse } from "@/types/global";

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<ApiResponse<Product[]>>("/products");
      setProducts(res.data.data);
      setError(null);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosClient.delete<ApiResponse<null>>(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Product</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Area</th>
              <th className="py-2 px-4 border-b">Available</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.area}</td>
                <td className="py-2 px-4 border-b">{product.isAvailable ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <Link href={`/products/${product.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
