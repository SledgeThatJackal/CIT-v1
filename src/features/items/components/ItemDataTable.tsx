"use client";

import { PageHeader } from "@/components/PageHeader";
import DataTable from "@/components/table/DataTable";
import FilterButton from "@/components/ui/custom/filter-button";
import { useTypes } from "@/features/types/hooks/useTypes";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  createItemImages,
  deleteItemImage,
  updateItem,
  updateItemImageOrders,
} from "../actions/item";
import { ItemType } from "../schema/item";
import CreateItemButton from "./CreateItemButton";
import { getColumns } from "../data/useTableData";

export default function ItemDataTable({
  items,
  type,
}: {
  items: ItemType[];
  type?: string;
}) {
  const [value, setValue] = useState<string | undefined>(
    type !== undefined ? type : undefined
  );

  const router = useRouter();
  const pathname = usePathname();

  const types = useTypes();

  useEffect(() => {
    const newPath = value !== undefined ? `/item/${value}` : "/item";

    if (pathname !== newPath) {
      router.push(newPath);
    }
  }, [pathname, router, value]);

  const columns = getColumns(items[0], type);

  return (
    <React.Fragment>
      <PageHeader title="Items">
        <div className="flex flex-row gap-2">
          <FilterButton options={types} value={value} setValue={setValue} />
          <CreateItemButton />
        </div>
      </PageHeader>
      <DataTable
        data={items}
        columns={columns}
        updateData={updateItem}
        addImages={createItemImages}
        reorderImages={updateItemImageOrders}
        deleteImage={deleteItemImage}
      />
    </React.Fragment>
  );
}
