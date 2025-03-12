"use client";

import BooleanCell from "@/components/renderers/BooleanCell";
import EditCell from "@/components/renderers/EditCell";
import ImageCell from "@/components/renderers/ImageCell";
import ParentCell from "@/components/renderers/ParentCell";
import DataTableHeader from "@/components/table/DataTableHeader";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import ActionsContainerCell from "../components/actions/ActionsContainerCell";
import { ContainerType } from "../schema/containers";

const columnHelper = createColumnHelper<ContainerType>();

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
    cell: ActionsContainerCell,
  }),
];

export { columns };
