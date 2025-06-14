"use client";
import React, { use, useEffect, useState } from "react";
import { useTable, useUpdateTable } from "@/app/tables/tableHooks";
import { useRouter } from "next/navigation";
import type { NewTable, Table } from "@/types/tables";

export default function EditTablePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data, isLoading, error: fetchError } = useTable(id);
  const updateTable = useUpdateTable();
  const [form, setForm] = useState<NewTable>({
    name: "",
    area: "",
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const { name, area, isActive } = data;
      setForm({ name, area, isActive });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateTable.mutate(
      { ...form as Table, id },
      {
        onSuccess: () => router.push("/tables"),
        onError: () => setError("Failed to update table"),
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError) return <div className="text-red-500">{fetchError instanceof Error ? fetchError.message : "Failed to load table"}</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Table</h1>
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
          disabled={updateTable.isPending}
        >
          {updateTable.isPending ? "Updating..." : "Update Table"}
        </button>
      </form>
    </div>
  );
}
