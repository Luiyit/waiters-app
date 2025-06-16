"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/products";
import { useProducts, useDeleteProduct } from "./productHooks";
import { useSession } from "next-auth/react";

export default function ProductsListPage() {
  // console log the active nextAuth session
  const { data: session } = useSession();
  console.log(session);
  const { data: products = [], isLoading: loading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    deleteProduct.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Link href="/products/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Product</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error instanceof Error ? error.message : "Failed to load products"}</div>
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
            {(products as Product[]).map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.area}</td>
                <td className="py-2 px-4 border-b">{product.isAvailable ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <Link href={`/products/${product.id}/sub-products`} className="text-green-600 hover:underline">Sub-Products</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
