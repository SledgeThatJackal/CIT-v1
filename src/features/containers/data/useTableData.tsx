"use client";

import BooleanCell from "@/components/renderers/BooleanCell";
import EditCell from "@/components/renderers/EditCell";
import ImageCell from "@/components/renderers/ImageCell";
import ParentCell from "@/components/renderers/ParentCell";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import ActionsContainerCell from "../components/actions/ActionsContainerCell";
import { ContainerType } from "../schema/containers";

const columnHelper = createColumnHelper<
  ContainerType & {
    containerItems: {
      id: string;
      itemId: string;
      quantity: number;
      item: {
        name: string;
      };
    }[];
  }
>();

const columns: ColumnDef<
  ContainerType & {
    containerItems: {
      id: string;
      itemId: string;
      quantity: number;
      item: {
        name: string;
      };
    }[];
  }
>[] = [
  {
    accessorKey: "containerImages",
    header: "Image(s)",
    cell: ImageCell,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "barcodeId",
    header: "Barcode ID",
    cell: EditCell,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditCell,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: EditCell,
  },
  {
    accessorKey: "parent",
    header: "Parent",
    cell: ParentCell,
  },
  {
    accessorKey: "isArea",
    header: "Area",
    cell: BooleanCell,
    enableSorting: false,
    enableColumnFilter: false,
  },
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ActionsContainerCell,
    enableSorting: false,
    enableColumnFilter: false,
  }),
];

export { columns };
