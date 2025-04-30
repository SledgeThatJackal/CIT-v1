import DataTable from "@/components/table/DataTable";
import { columns } from "../data/useTableData";
import {
  createItemImages,
  deleteItemImage,
  updateItem,
  updateItemImageOrders,
} from "../actions/item";

export default function ItemDataTable({
  items,
}: {
  items: {
    id: string;
    name: string;
    description?: string;
    externalURL?: string;
    createdAt: Date;
    updatedAt: Date;
    tags: {
      id: string;
      name: string;
      description?: string | null;
      color: string;
    }[];
    itemType?: {
      id: string;
      name: string;
    };
    itemAttributes: {
      id: string;
      typeAttributeId: string;
      textValue?: string;
      numericValue?: number;
    }[];
    containerItems: {
      id: string;
      containerId: string;
      quantity: number;
    }[];
    itemImages: {
      id: string;
      image: {
        id: string;
        fileName: string;
      };
      imageOrder: number;
    }[];
  }[];
}) {
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
