import DataTable from "@/components/table/DataTable";
import {
  createItemImages,
  deleteItemImage,
  updateItem,
  updateItemImageOrders,
} from "../actions/item";
import { columns } from "../data/useTableData";
import { ItemType } from "../schema/item";

export default function ItemDataTable({ items }: { items: ItemType[] }) {
  return (
    <DataTable
      data={items}
      columns={columns}
      updateData={updateItem}
      addImages={createItemImages}
      reorderImages={updateItemImageOrders}
      deleteImage={deleteItemImage}
    />
  );
}
