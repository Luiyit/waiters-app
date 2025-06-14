"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateTable } from "../tableHooks";
import type { NewTable } from "@/types/tables";

export default function CreateTablePage() {
  const router = useRouter();
  const createTable = useCreateTable();
  const [form, setForm] = useState<NewTable>({
    name: "",
    area: "",
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createTable.mutate(form, {
      onSuccess: () => router.push("/tables"),
      onError: () => setError("Failed to create table"),
    });
  };

  const loading = createTable.isPending;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Table</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Area</label>
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select area</option>
            <option value="Piscina">Piscina</option>
            <option value="Terraza">Terraza</option>
            <option value="Otra">Otra</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Active</label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Table"}
        </button>
      </form>
    </div>
  );
}
