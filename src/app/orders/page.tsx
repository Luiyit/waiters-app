"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/types/orders";
import { useOrders, useDeleteOrder } from "./orderHooks";

export default function OrdersListPage() {
  const { data: orders = [], isLoading: loading, error } = useOrders();
  const deleteOrder = useDeleteOrder();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    deleteOrder.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/orders/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Order</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error instanceof Error ? error.message : "Failed to load orders"}</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Table</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(orders as Order[]).map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.tableId}</td>
                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <Link href={`/orders/${order.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
