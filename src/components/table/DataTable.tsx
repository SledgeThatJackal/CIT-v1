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
import { cn } from "@/lib/utils";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  SortDirection,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { Input } from "../ui/input";

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
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [bodyKey, setBodyKey] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    meta: {
      updateData,
      addImages,
      reorderImages,
      deleteImage,
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  function updateFilter() {
    const params = new URLSearchParams(searchParams);
    // params.set("filters", columnFilters);
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
            <TableRow key={headers.id} className="h-15.5">
              {headers.headers.map((header) => {
                return <CustomHeader key={header.id} header={header} />;
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

function CustomHeader<TData>({ header }: { header: Header<TData, unknown> }) {
  function getTitle(sortDirection: SortDirection | false) {
    switch (sortDirection) {
      case "asc": {
        return "Sort Ascending";
      }
      case "desc": {
        return "Sort Descending";
      }
      case false: {
        return undefined;
      }
      default: {
        return "Clear";
      }
    }
  }

  return (
    <TableHead colSpan={header.colSpan}>
      {header.isPlaceholder ? null : (
        <>
          <div
            className={cn(
              "items-center select-none",
              header.column.getCanSort()
                ? "flex flex-row gap-1 cursor-pointer"
                : "text-center"
            )}
            onClick={header.column.getToggleSortingHandler()}
            title={getTitle(header.column.getNextSortingOrder())}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
              asc: <ChevronUp size="16" />,
              desc: <ChevronDown size="16" />,
            }[header.column.getIsSorted() as string] ?? null}
          </div>
          {header.column.getCanFilter() ? (
            <div>
              <Filter column={header.column} />
            </div>
          ) : null}
        </>
      )}
    </TableHead>
  );
}

function Filter<TData>({ column }: { column: Column<TData, unknown> }) {
  const filterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  switch (filterVariant) {
    case "number": {
      return <div>IMPLEMENT</div>;
    }
    case "select": {
      return <div>IMPLEMENT</div>;
    }
    default: {
      return (
        <DebouncedInput
          onChange={(value) => column.setFilterValue(value)}
          placeholder="Search..."
          type="text"
          value={(filterValue ?? "") as string}
        />
      );
    }
  }
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      className="h-[1.5rem] w-auto text-sm"
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
