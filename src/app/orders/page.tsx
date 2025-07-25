"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/types/orders";
import { useOrders, useDeleteOrder, useTables } from "./orderHooks";

export default function OrdersListPage() {
  const { data: orders = [], isLoading: loading, error } = useOrders();
  const deleteOrder = useDeleteOrder();
  const { data: tables = [] } = useTables();

  const getTableName = (tableId: string) =>
    tables.find((t) => t.id === tableId)?.name || "N/A";

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    deleteOrder.mutate(id);
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
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
        <Link
          href="/orders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Order
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load orders"}
        </div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Table</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(orders as Order[]).map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/orders/${order.id}/orderProducts`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {getTableName(order.tableId)}
                </td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <Link
                    href={`/orders/${order.id}/orderProducts`}
                    className="text-blue-600 hover:underline"
                  >
                    Products
                  </Link>
                  <Link
                    href={`/orders/${order.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
