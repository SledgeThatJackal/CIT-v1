"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ItemType } from "../schema/item";
import ImageCell from "@/components/renderers/ImageCell";
import EditCell from "@/components/renderers/EditCell";
import ActionsItemCell from "../components/actions/ActionsItemCell";
import Link from "next/link";
import TagCell from "../components/renderers/TagCell";
import TypeCell from "../components/renderers/TypeCell";

const columnHelper = createColumnHelper<ItemType>();

const columns: ColumnDef<ItemType>[] = [
  {
    accessorKey: "itemImages",
    header: "Image(s)",
    cell: ImageCell,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "externalUrl",
    header: "URL",
    cell: ({ getValue }) => <Link href={`${getValue()}`}>Link</Link>,
    enableSorting: false,
    enableColumnFilter: false,
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
    accessorKey: "",
    header: "Tag(s)",
    cell: TagCell,
  },
  {
    accessorKey: "",
    header: "Type",
    cell: TypeCell,
  },
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ActionsItemCell,
    enableSorting: false,
    enableColumnFilter: false,
  }),
];

export { columns };
