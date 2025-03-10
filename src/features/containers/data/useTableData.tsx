"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ContainerType } from "../schema/containers";
import ImageCell from "@/components/renderers/ImageCell";
import EditCell from "@/components/renderers/EditCell";
import ParentCell from "@/components/renderers/ParentCell";
import BooleanCell from "@/components/renderers/BooleanCell";
import ActionsCell from "@/components/renderers/ActionsCell";
import DataTableHeader from "@/components/table/DataTableHeader";

const columnHelper = createColumnHelper<ContainerType>();

const data: ContainerType[] = [];

const columns: ColumnDef<ContainerType>[] = [
  {
    accessorKey: "containerImages",
    header: () => null,
    cell: ImageCell,
  },
  {
    accessorKey: "barcodeId",
    header: ({ column }) => (
      <DataTableHeader title="Barcode ID" column={column} />
    ),
    cell: EditCell,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableHeader title="Name" column={column} />,
    cell: EditCell,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableHeader title="Description" column={column} />
    ),
    cell: EditCell,
  },
  {
    accessorKey: "parent",
    header: ({ column }) => <DataTableHeader title="Parent" column={column} />,
    cell: ParentCell,
  },
  {
    accessorKey: "isArea",
    header: ({ column }) => (
      <DataTableHeader className="text-center" title="Area" column={column} />
    ),
    cell: BooleanCell,
  },
  columnHelper.display({
    id: "actions",
    header: ({ column }) => (
      <DataTableHeader
        className="text-center"
        title="Actions"
        column={column}
      />
    ),
    cell: ActionsCell,
  }),
];

export { data, columns };
