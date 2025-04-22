/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  updateData: (id: string, data: any) => Promise<{ message: string }>;
  addImages?: (id: string, data: any) => Promise<{ message: string }>;
  reorderImages?: (data: any) => Promise<{ message: string }>;
  deleteImage?: (data: any) => Promise<{ message: string }>;
};

export default function DataTable<TData, TValue>({
  columns,
  data,
  updateData,
  addImages,
  reorderImages,
  deleteImage,
}: DataTableProps<TData, TValue>) {
  const [filters, setFilters] = useState("");
  const [bodyKey, setBodyKey] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData,
      addImages,
      reorderImages,
      deleteImage,
    },
  });

  function updateFilter() {
    const params = new URLSearchParams(searchParams);
    params.set("filters", filters);
    router.replace(`?${params.toString()}`);
  }

  useEffect(() => {
    setBodyKey((prev) => prev + 1);
  }, [data.length]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headers) => (
            <TableRow key={headers.id}>
              {headers.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody key={`body-${bodyKey}`}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
