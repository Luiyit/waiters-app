"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/app/products/productHooks";
import { useSubProducts, useSearchSubProducts, useLinkSubProduct, useDeleteSubProduct } from "@/app/products/subProductHooks";

export default function SubProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: productId } = use(params);
  const { data: product, isLoading: isProductLoading } = useProduct(productId);
  const { data: linkedSubProducts = [], isLoading: isSubProductsLoading } = useSubProducts(productId);
  const [searchQuery, setSearchQuery] = useState("");
  const searchSubProducts = useSearchSubProducts(searchQuery);
  const linkSubProduct = useLinkSubProduct(productId);
  const deleteSubProduct = useDeleteSubProduct(productId);
  const [error, setError] = useState<string | null>(null);

  // Handle linking a sub-product
  const handleLink = async (subProductId: string) => {
    try {
      await linkSubProduct.mutateAsync(subProductId);
      setSearchQuery("");
    } catch (err) {
      console.error(err);
      setError("Failed to link sub-product");
    }
  };

  // Handle unlinking a sub-product
  const handleUnlink = async (subProductId: string) => {
    if (!confirm("Are you sure you want to unlink this sub-product?")) return;
    try {
      await deleteSubProduct.mutateAsync(subProductId);
    } catch (err) {
      console.error(err);
      setError("Failed to unlink sub-product");
    }
  };

  if (isProductLoading || isSubProductsLoading) return <div className="max-w-4xl mx-auto py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/products`)}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Sub-Products for {product?.name}</h1>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push(`/products/${productId}/sub-products/create`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New Sub-Product
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sub-products..."
            className="w-full border px-4 py-2 rounded"
          />
          {searchSubProducts.data && searchSubProducts.data.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              {searchSubProducts.data.map((result) => (
                <div
                  key={result.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleLink(result.id)}
                >
                  <span>{result.name}</span>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLink(result.id);
                    }}
                  >
                    Link
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Linked Sub-Products List */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Linked Sub-Products</h2>
        </div>
        <div className="divide-y">
          {linkedSubProducts.map((subProduct) => (
            <div key={subProduct.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{subProduct.name}</h3>
                <p className="text-sm text-gray-600">{subProduct.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/products/${productId}/sub-products/${subProduct.id}/edit`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleUnlink(subProduct.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={deleteSubProduct.isPending}
                >
                  Unlink
                </button>
              </div>
            </div>
          ))}
          {linkedSubProducts.length === 0 && (
            <div className="p-4 text-gray-500 text-center">
              No sub-products linked yet. Use the search above to link existing sub-products or create new ones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 