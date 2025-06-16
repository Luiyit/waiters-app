'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowClassName?: (row: TData) => string;
  className?: string;
}

export function Table<TData>({ data, columns, getRowClassName, className = '' }: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Map columnId to header renderer for mobile labels
  const columnIdToHeader: Record<string, React.ReactNode> = {};
  table.getHeaderGroups()[0]?.headers.forEach((header) => {
    columnIdToHeader[header.column.id] = flexRender(header.column.columnDef.header, header.getContext());
  });

  return (
    <div className={`rounded-md ${className}`}>
      <table className="w-full flex flex-row flex-no-wrap sm:bg-white overflow-hidden sm:shadow-lg sm:rounded-lg sm:border sm:border-gray-300">
        <thead className="hidden sm:table-header-group">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr 
              key={headerGroup.id}
              className="bg-gray-700 text-white flex flex-col flex-no-wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left border border-gray-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="flex-1 sm:flex-none">
          {table.getRowModel().rows.map((row) => (
            <tr 
              key={row.id}
              className={`flex flex-col flex-no-wrap sm:table-row mb-2 sm:mb-0 rounded-lg sm:rounded-none ${getRowClassName ? getRowClassName(row.original) : ''}`}
            >
              {row.getVisibleCells().map((cell) => {
                const headerLabel = columnIdToHeader[cell.column.id];
                return (
                  <td 
                    key={cell.id} 
                    className="p-3 border border-gray-300"
                  >
                    {/* Mobile label */}
                    <span className="block font-bold text-xs text-gray-500 mb-1 sm:hidden">
                      {headerLabel}
                    </span>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 