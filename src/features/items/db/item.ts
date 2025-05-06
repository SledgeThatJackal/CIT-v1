import { db } from "@/drizzle/db";
import {
  ContainerItemTable,
  ItemAttributeTable,
  ItemImageTable,
  ItemTable,
  ItemTagTable,
  TypeAttributeTable,
} from "@/drizzle/schema";
import { and, eq, max, notExists, sql } from "drizzle-orm";
import { revalidateItemCache } from "./cache/item";
import { revalidateItemImageCache } from "@/features/images/db/cache/images";
import { revalidateTagCache } from "@/features/tags/db/cache/tag";

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
  data: Partial<typeof ItemTable.$inferInsert> & {
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
  const updatedItem = await db.transaction(async (trx) => {
    const [updatedItem] = await trx
      .update(ItemTable)
      .set(data)
      .where(eq(ItemTable.id, id))
      .returning();

    if (updatedItem == null) throw new Error("Failed to update item");

    if (data.tags && data.tags.length > 0) {
      // Upsert
      const tags = await trx
        .insert(ItemTagTable)
        .values(
          data.tags.map((tag) => ({
            itemId: updatedItem.id,
            tagId: tag,
          }))
        )
        .onConflictDoNothing()
        .returning();

      // Remove
      await trx.delete(ItemTagTable).where(
        and(
          eq(ItemTagTable.itemId, updatedItem.id),
          notExists(
            db
              .select()
              .from(
                sql`(values ${sql.join(
                  data.tags.map((tag) => sql`(${tag}::uuid)`),
                  sql`,`
                )}) as new_tags(tag_id)`
              )
              .where(sql`new_tags.tag_id = ${ItemTagTable.tagId}`)
          )
        )
      );

      if (tags == null) {
        trx.rollback();
        throw new Error("Failed to update tags");
      }
    }

    if (data.itemAttributes && data.itemAttributes.length > 0) {
      // Upsert
      const itemAttributes = await trx
        .insert(ItemAttributeTable)
        .values(
          data.itemAttributes.map((itemAttribute) => ({
            typeAttributeId: itemAttribute.typeAttributeId,
            itemId: updatedItem.id,
            textValue: itemAttribute.textValue ?? null,
            numericValue: itemAttribute.numericValue ?? null,
          }))
        )
        .onConflictDoUpdate({
          target: [
            ItemAttributeTable.itemId,
            ItemAttributeTable.typeAttributeId,
          ],
          set: {
            textValue: sql.raw(`excluded."textValue"`),
            numericValue: sql.raw(`excluded."numericValue"`),
          },
        })
        .returning();

      // There's no need to remove anything from item attributes because if the type is removed,
      // the item attributes will automatically be removed as well.

      if (itemAttributes == null) {
        trx.rollback();
        throw new Error("Failed to create attributes");
      }
    }

    if (data.containerItems && data.containerItems.length > 0) {
      // Upsert
      const containerItems = await trx
        .insert(ContainerItemTable)
        .values(
          data.containerItems.map((containerItem) => ({
            containerId: containerItem.containerId,
            itemId: updatedItem.id,
            quantity: containerItem.quantity,
          }))
        )
        .onConflictDoUpdate({
          target: [ContainerItemTable.itemId, ContainerItemTable.containerId],
          set: { quantity: sql`excluded.quantity` },
        })
        .returning();

      // Remove
      await trx.delete(ContainerItemTable).where(
        and(
          eq(ContainerItemTable.itemId, updatedItem.id),
          notExists(
            db
              .select()
              .from(
                sql`(values ${sql.join(
                  data.containerItems.map(
                    (ci) => sql`(${ci.containerId}::uuid)`
                  ),
                  sql`,`
                )}) as new_containeritems(container_id)`
              )
              .where(
                sql`new_containeritems.container_id = ${ContainerItemTable.containerId}`
              )
          )
        )
      );

      if (containerItems == null) {
        trx.rollback();
        throw new Error("Failed to put items into their containers");
      }
    }

    if (data.itemImages && data.itemImages.length > 0) {
      // Upsert
      const itemImages = await trx
        .insert(ItemImageTable)
        .values(
          data.itemImages.map((imageId, index) => ({
            imageId: imageId,
            itemId: updatedItem.id,
            imageOrder: index,
          }))
        )
        .onConflictDoNothing({
          target: [ItemImageTable.itemId, ItemImageTable.imageId],
        })
        .returning();

      // Remove
      await trx.delete(ItemImageTable).where(
        and(
          eq(ItemImageTable.itemId, updatedItem.id),
          notExists(
            db
              .select()
              .from(
                sql`(values ${sql.join(
                  data.itemImages.map((itemImage) => sql`(${itemImage}::uuid)`),
                  sql`,`
                )}) as new_itemimages(image_id)`
              )
              .where(sql`new_itemimages.image_id = ${ItemImageTable.imageId}`)
          )
        )
      );

      if (itemImages == null) {
        trx.rollback();
        throw new Error("Failed to create images");
      }
    }

    return updatedItem;
  });

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

export async function updateItemType(id: string, itemTypeId: string) {
  const updatedItem = await db.transaction(async (trx) => {
    const [updatedItem] = await trx
      .update(ItemTable)
      .set({
        itemTypeId,
      })
      .where(eq(ItemTable.id, id))
      .returning();

    if (updatedItem == null) throw new Error("Failed to update type");

    await trx
      .delete(ItemAttributeTable)
      .where(eq(ItemAttributeTable.itemId, id));

    const typeAttributes = await trx.query.TypeAttributeTable.findMany({
      where: eq(TypeAttributeTable.itemTypeId, itemTypeId),
      columns: {
        id: true,
        textDefaultValue: true,
        numericDefaultValue: true,
      },
    });

    if (typeAttributes.length > 0) {
      await trx.insert(ItemAttributeTable).values(
        typeAttributes.map(
          ({ id: typeAttributeId, textDefaultValue, numericDefaultValue }) => ({
            itemId: updatedItem.id,
            typeAttributeId,
            textValue: textDefaultValue,
            numberValue: numericDefaultValue,
          })
        )
      );
    }

    return updatedItem;
  });

  revalidateItemCache(id);

  return updatedItem;
}

export async function updateItemTags(id: string, tagIds: string[]) {
  const tags = await db.transaction(async (trx) => {
    // Update
    const tags = await trx
      .insert(ItemTagTable)
      .values(tagIds.map((tag) => ({ itemId: id, tagId: tag })))
      .onConflictDoNothing({
        target: [ItemTagTable.itemId, ItemTagTable.tagId],
      })
      .returning();

    // Remove
    await trx.delete(ItemTagTable).where(
      and(
        eq(ItemTagTable.itemId, id),
        notExists(
          db
            .select()
            .from(
              sql`(values ${sql.join(
                tagIds.map((tag) => sql`(${tag}::uuid)`),
                sql`,`
              )}) as new_tags(tag_id)`
            )
            .where(sql`new_tags.tag_id = ${ItemTagTable.tagId}`)
        )
      )
    );

    if (tags == null) {
      trx.rollback();
      throw new Error("Failed to update tags");
    }

    return tags;
  });

  tags.forEach((tag) => revalidateTagCache(tag.tagId));
  revalidateItemCache(id);

  return tags;
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
