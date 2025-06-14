"use client";

import React from "react";
import Link from "next/link";
import { Table } from "@/types/tables";
import { useTables, useDeleteTable } from "./tableHooks";

export default function TablesListPage() {
  const { data: tables = [], isLoading: loading, error } = useTables();
  const deleteTable = useDeleteTable();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return;
    deleteTable.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tables</h1>
        <Link href="/tables/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Table</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error instanceof Error ? error.message : "Failed to load tables"}</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Area</th>
              <th className="py-2 px-4 border-b">Active</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table: Table) => (
              <tr key={table.id}>
                <td className="py-2 px-4 border-b">{table.id}</td>
                <td className="py-2 px-4 border-b">{table.name}</td>
                <td className="py-2 px-4 border-b">{table.area}</td>
                <td className="py-2 px-4 border-b">{table.isActive ? "Yes" : "No"}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/tables/${table.id}/edit`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                  <button onClick={() => handleDelete(table.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
