"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/products";
import { useProducts, useDeleteProduct } from "./productHooks";
import { useSession } from "next-auth/react";
import { Table } from "@/components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, FolderIcon, TrashIcon, ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/Button";

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

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "area",
      header: "Area",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link 
            href={`/products/${row.original.id}/edit`} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>
          <Link 
            href={`/products/${row.original.id}/sub-products`} 
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Sub-Products"
          >
            <FolderIcon className="h-5 w-5" />
          </Link>
          <button 
            onClick={() => handleDelete(row.original.id)} 
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            href="/"
            variant="ghost"
            size="icon"
            icon={ArrowLeftIcon}
            className="text-gray-600 hover:text-gray-900"
          />
          Products
        </div>
        <Button
          href="/products/create"
          variant="outline"
          icon={PlusIcon}
        >
          Product
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error instanceof Error ? error.message : "Failed to load products"}</div>
      ) : (
        <div className="container">
          <Table 
            data={products} 
            columns={columns} 
            getRowClassName={(row) => !row.isAvailable ? 'row-unavailable' : ''}
            className="my-5"
          />
        </div>
      )}
    </div>
  );
}
