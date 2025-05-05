import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import {
  ContainerItemTable,
  ContainerTable,
  ImageTable,
  ItemAttributeTable,
  ItemImageTable,
  ItemTable,
  ItemTagTable,
  ItemTypeTable,
  TagTable,
  TypeAttributeTable,
} from "@/drizzle/schema";
import CreateItemButton from "@/features/items/components/CreateItemButton";
import ItemDataTable from "@/features/items/components/ItemDataTable";
import { ItemContextProvider } from "@/features/items/data/ItemContextProvider";
import { getItemGlobalTag } from "@/features/items/db/cache/item";
import { ItemType } from "@/features/items/schema/item";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { SimpleTypeSchema } from "@/features/types/schema/type";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { getImages } from "../../container/page";

export default async function Item() {
  const itemData = await getItems();
  const images = await getImages();
  const types = await getTypes();
  const tags = await getTags();
  const containers = await getContainers();

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div className="text-xl">No containers found</div>}>
        <ItemContextProvider
          images={images}
          tags={tags}
          types={types}
          containers={containers}
        >
          <PageHeader title="Items">
            <CreateItemButton />
          </PageHeader>
          <ItemDataTable items={itemData} />
        </ItemContextProvider>
      </Suspense>
    </div>
  );
}

async function getItems() {
  "use cache";

  cacheTag(getItemGlobalTag());

  const rows = db
    .select({
      id: ItemTable.id,
      name: ItemTable.name,
      description: ItemTable.description,
      externalURL: ItemTable.externalUrl,
      createdAt: ItemTable.createdAt,
      updatedAt: ItemTable.updatedAt,
      tag: {
        id: TagTable.id,
        name: TagTable.name,
        description: TagTable.description,
        color: TagTable.color,
      },
      type: {
        id: ItemTypeTable.id,
        name: ItemTypeTable.name,
      },
      itemAttribute: {
        id: ItemAttributeTable.id,
        typeAttributeId: ItemAttributeTable.typeAttributeId,
        textValue: ItemAttributeTable.textValue,
        numericValue: ItemAttributeTable.numericValue,
      },
      containerItem: {
        id: ContainerItemTable.id,
        containerId: ContainerItemTable.containerId,
        quantity: ContainerItemTable.quantity,
      },
      itemImage: {
        id: ItemImageTable.id,
        imageId: ImageTable.id,
        fileName: ImageTable.fileName,
        imageOrder: ItemImageTable.imageOrder,
      },
    })
    .from(ItemTable)
    .leftJoin(ItemTagTable, eq(ItemTable.id, ItemTagTable.itemId))
    .leftJoin(TagTable, eq(ItemTagTable.tagId, TagTable.id))
    .leftJoin(ItemTypeTable, eq(ItemTable.itemTypeId, ItemTypeTable.id))
    .leftJoin(ItemAttributeTable, eq(ItemTable.id, ItemAttributeTable.itemId))
    .leftJoin(ContainerItemTable, eq(ItemTable.id, ContainerItemTable.itemId))
    .leftJoin(ItemImageTable, eq(ItemTable.id, ItemImageTable.itemId))
    .leftJoin(ImageTable, eq(ItemImageTable.imageId, ImageTable.id))
    .orderBy(asc(ItemTable.name));

  const items = new Map<string, ItemType>();

  (await rows).forEach((row) => {
    if (!items.has(row.id)) {
      items.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        externalUrl: row.externalURL ?? "",
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: [],
        itemType: {
          id: row.type?.id ?? "",
          name: row.type?.name ?? "",
        },
        itemAttributes: [],
        itemImages: [],
        containerItems: [],
      });
    }

    const item = items.get(row.id);

    if (row.tag?.id) {
      item?.tags?.push({
        id: row.tag.id,
        name: row.tag.name,
        description: row.tag.description ?? "",
        color: row.tag.color,
      });
    }

    if (row.itemAttribute?.id) {
      item?.itemAttributes?.push({
        id: row.itemAttribute.id,
        typeAttributeId: row.itemAttribute.typeAttributeId,
        textValue: row.itemAttribute.textValue ?? "",
        numericValue: row.itemAttribute.numericValue ?? -1,
      });
    }

    if (row.containerItem?.id) {
      item?.containerItems?.push({
        ...row.containerItem,
      });
    }

    if (row.itemImage.id) {
      item?.itemImages?.push({
        id: row.itemImage.id,
        imageOrder: row.itemImage.imageOrder ?? 0,
        image: {
          id: row.itemImage.imageId ?? "",
          fileName: row.itemImage.fileName ?? "",
        },
      });
    }
  });

  return Array.from(items.values());
}

export async function getTags() {
  "use cache";

  cacheTag(getTagGlobalTag());

  return await db.query.TagTable.findMany({
    columns: {
      updatedAt: false,
      createdAt: false,
    },
    orderBy: TagTable.name,
  });
}

export async function getTypes() {
  "use cache";

  cacheTag();

  const rows = db
    .select({
      id: ItemTypeTable.id,
      name: ItemTypeTable.name,
      typeAttribute: {
        id: TypeAttributeTable.id,
        title: TypeAttributeTable.title,
        displayOrder: TypeAttributeTable.displayOrder,
        dataType: TypeAttributeTable.dataType,
        textDefaultValue: TypeAttributeTable.textDefaultValue,
        numericDefaultValue: TypeAttributeTable.numericDefaultValue,
      },
    })
    .from(ItemTypeTable)
    .leftJoin(
      TypeAttributeTable,
      eq(ItemTypeTable.id, TypeAttributeTable.itemTypeId)
    );

  const types = new Map<string, SimpleTypeSchema>();

  (await rows).forEach((row) => {
    if (!types.has(row.id)) {
      types.set(row.id, {
        id: row.id,
        name: row.name ?? "",
        typeAttributes: [],
      });
    }

    const type = types.get(row.id);

    if (row.typeAttribute?.id) {
      type?.typeAttributes.push(row.typeAttribute);
    }
  });

  return Array.from(types.values());
}

export async function getContainers() {
  "use cache";

  cacheTag(getContainerGlobalTag());

  return await db.query.ContainerTable.findMany({
    columns: {
      id: true,
      name: true,
      barcodeId: true,
    },
    orderBy: ContainerTable.name,
  });
}
