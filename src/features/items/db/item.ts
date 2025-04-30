import { db } from "@/drizzle/db";
import {
  ContainerItemTable,
  ItemAttributeTable,
  ItemImageTable,
  ItemTable,
  ItemTagTable,
} from "@/drizzle/schema";
import { eq, max } from "drizzle-orm";
import { revalidateItemCache } from "./cache/item";
import { revalidateItemImageCache } from "@/features/images/db/cache/images";

export async function insertItem(
  data: typeof ItemTable.$inferInsert & {
    tags?: string[];
    itemAttributes?: {
      typeAttributeId: string;
      textValue?: string;
      numericValue?: number;
    }[];
    itemImages?: string[];
    containerItems?: {
      containerId: string;
      quantity: number;
    }[];
  }
) {
  const newItem = await db.transaction(async (trx) => {
    const [newItem] = await trx.insert(ItemTable).values(data).returning();

    if (newItem == null) {
      trx.rollback();
      throw new Error("Failed to create item");
    }

    if (data.tags && data.tags.length > 0) {
      const tags = await trx
        .insert(ItemTagTable)
        .values(
          data.tags.map((tag) => ({
            itemId: newItem.id,
            tagId: tag,
          }))
        )
        .returning();

      if (tags == null || tags.length !== data.tags.length) {
        trx.rollback();
        throw new Error("Failed to create tags");
      }
    }

    if (data.itemAttributes && data.itemAttributes.length > 0) {
      const itemAttributes = await trx
        .insert(ItemAttributeTable)
        .values(
          data.itemAttributes.map((itemAttribute) => ({
            typeAttributeId: itemAttribute.typeAttributeId,
            itemId: newItem.id,
            textValue: itemAttribute.textValue ?? null,
            numericValue: itemAttribute.numericValue ?? null,
          }))
        )
        .returning();

      if (
        itemAttributes == null ||
        itemAttributes.length !== data.itemAttributes.length
      ) {
        trx.rollback();
        throw new Error("Failed to create attributes");
      }
    }

    if (data.containerItems && data.containerItems.length > 0) {
      const containerItems = await trx
        .insert(ContainerItemTable)
        .values(
          data.containerItems.map((containerItem) => ({
            containerId: containerItem.containerId,
            itemId: newItem.id,
            quantity: containerItem.quantity,
          }))
        )
        .returning();

      if (
        containerItems == null ||
        containerItems.length !== data.containerItems.length
      ) {
        trx.rollback();
        throw new Error("Failed to put items into their containers");
      }
    }

    if (data.itemImages && data.itemImages.length > 0) {
      const itemImages = await trx
        .insert(ItemImageTable)
        .values(
          data.itemImages.map((imageId, index) => ({
            imageId: imageId,
            itemId: newItem.id,
            imageOrder: index,
          }))
        )
        .returning();

      if (itemImages == null || itemImages.length !== data.itemImages.length) {
        trx.rollback();
        throw new Error("Failed to create images");
      }
    }

    return newItem;
  });

  if (newItem == null) throw new Error("Failed to create item");

  revalidateItemCache(newItem.id);

  return newItem;
}

export async function insertItemImages(id: string, imageIds: string[]) {
  const itemImages = await db.transaction(async (trx) => {
    const [maxImageOrder] = await trx
      .select({ imageOrder: max(ItemImageTable.imageOrder) })
      .from(ItemImageTable)
      .where(eq(ItemImageTable.id, id));

    const imageOrder = maxImageOrder?.imageOrder ?? 0;

    const itemImages = await trx
      .insert(ItemImageTable)
      .values(
        imageIds.map((imageId, index) => ({
          itemId: id,
          imageId: imageId,
          imageOrder: imageOrder + index + 1,
        }))
      )
      .returning();

    if (itemImages.length === 0) {
      trx.rollback();
      throw new Error("Failed to create images");
    }

    return itemImages;
  });

  itemImages.forEach(({ id, itemId, imageId }) =>
    revalidateItemImageCache(id, itemId, imageId)
  );
}

export async function updateItem(
  id: string,
  data: Partial<typeof ItemTable.$inferInsert>
) {
  const [updatedItem] = await db
    .update(ItemTable)
    .set(data)
    .where(eq(ItemTable.id, id))
    .returning();

  if (updatedItem == null) throw new Error("Failed to update item");

  revalidateItemCache(updatedItem.id);

  return updatedItem;
}

export async function updateItemImageOrders(ids: string[]) {
  const itemImages = await Promise.all(
    ids.map((id, index) =>
      db
        .update(ItemImageTable)
        .set({ imageOrder: index })
        .where(eq(ItemImageTable.id, id))
        .returning({
          id: ItemImageTable.id,
          itemId: ItemImageTable.id,
          imageId: ItemImageTable.imageId,
        })
    )
  );

  itemImages.flat().forEach(({ id, itemId, imageId }) => {
    revalidateItemImageCache(id, itemId, imageId);
  });
}

export async function deleteItem(id: string) {
  const [deletedItem] = await db
    .delete(ItemTable)
    .where(eq(ItemTable.id, id))
    .returning();

  if (deletedItem == null) throw new Error("Failed to delete item");

  revalidateItemCache(id);

  return deletedItem;
}

export async function deleteItemImage(id: string) {
  const [deletedItemImage] = await db
    .delete(ItemImageTable)
    .where(eq(ItemImageTable.id, id))
    .returning();

  if (deletedItemImage == null) throw new Error("Failed to delete image");

  revalidateItemImageCache(
    deletedItemImage.id,
    deletedItemImage.itemId,
    deletedItemImage.imageId
  );
}
