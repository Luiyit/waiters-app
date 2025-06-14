"use client";
import React, { use } from "react";
import Link from "next/link";
import { useProductItems, useDeleteProductItem } from "./orderItemHooks";
import { useOrder } from "../../orderHooks";
import type { ProductItem } from "@/types/orderItems";
import { OrderStatus } from "@/types/orders";

export default function ProductItemsListPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: items = [], isLoading, error } = useProductItems(orderId);
  const deleteProductItem = useDeleteProductItem(orderId);
  const { data: order } = useOrder(orderId);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteProductItem.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 text-xl mr-2"
            aria-label="Back to Orders"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold">Order Items</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`./payments/create`}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition$${
              order && ![OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(order.status)
                ? " opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={
              order && ![OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(order.status)
            }
          >
            Close Order
          </Link>
          <Link
            href={`./orderItems/create`}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition${
              order && ![OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(order.status)
                ? " opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={
              order && ![OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(order.status)
            }
          >
            Add Item
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading items</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item: ProductItem) => (
            <li key={item.id} className="py-4 flex justify-between items-center">
              <span>{item.name} (x{item.quantity})</span>
              <div className="flex gap-2">
                <Link
                  href={`./orderItems/${item.id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
