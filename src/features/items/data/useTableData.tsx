"use client";

import EditCell from "@/components/renderers/EditCell";
import ImageCell from "@/components/renderers/ImageCell";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import ActionsItemCell from "../components/actions/ActionsItemCell";
import TagCell from "../components/renderers/TagCell";
import TypeCell from "../components/renderers/TypeCell";
import { ItemType } from "../schema/item";

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
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return null;

      return (
        <Link href={`${value}`} className="flex justify-center">
          Link
        </Link>
      );
    },
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
    accessorKey: "tags",
    header: () => <div className="text-start">Tag(s)</div>,
    cell: TagCell,
    enableSorting: false,
  },
  {
    accessorKey: "itemType",
    header: "Type",
    cell: TypeCell,
    filterFn: (row, columnId, filterValue) => {
      const { name } = row.getValue<{ id: string; name: string }>(columnId);

      return (
        name.localeCompare(filterValue, undefined, {
          sensitivity: "accent",
        }) === 0
      );
    },
  },
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ActionsItemCell,
    enableSorting: false,
    enableColumnFilter: false,
  }),
];

export function getColumns(
  items?: ItemType,
  type?: string
): ColumnDef<ItemType>[] {
  if (!type) return columns;

  const itemAttributes = items?.itemAttributes.sort(
    (a, b) => a.typeAttribute.displayOrder - b.typeAttribute.displayOrder
  );

  const attributeColumns =
    itemAttributes?.map((itemAttribute, index) =>
      columnHelper.accessor(
        (row) =>
          row.itemAttributes[index]?.typeAttribute.dataType.startsWith("s")
            ? row.itemAttributes[index].textValue
            : row.itemAttributes[index]?.numericValue,
        {
          id: `typeAttribute_${itemAttribute.typeAttribute.dataType}-${itemAttribute.typeAttribute.title}`,
          header: () => (
            <div className="text-start">
              {itemAttribute.typeAttribute.title}
            </div>
          ),
          cell: ({ getValue }) => <div>{getValue()}</div>,
          enableSorting: false,
        }
      )
    ) ?? [];

  const startingColumns = columns.slice(0, columns.length - 2);
  const endingColumns = columns.slice(columns.length - 2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedColumns: any = [
    ...startingColumns,
    ...(attributeColumns || []),
    ...endingColumns,
  ];

  return typedColumns;
}
