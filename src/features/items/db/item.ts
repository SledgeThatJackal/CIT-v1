import { db } from "@/drizzle/db";
import {
  ContainerImageTable,
  ContainerItemTable,
  ItemAttributeTable,
  ItemImageTable,
  ItemTable,
  ItemTagTable,
  TypeAttributeTable,
} from "@/drizzle/schema";
import { revalidateContainerCache } from "@/features/containers/db/cache/containers";
import {
  revalidateContainerImageCache,
  revalidateItemImageCache,
} from "@/features/images/db/cache/images";
import { revalidateTagCache } from "@/features/tags/db/cache/tag";
import { and, eq, inArray, max, notExists, sql } from "drizzle-orm";
import { revalidateItemCache } from "./cache/item";
import {
  createContainerItems,
  createDuplicateItemAttributes,
  createItemAttributes,
  createItemImages,
  createItemTags,
  getTotal,
  processItemAttributes,
} from "./helper";

export async function insertItem(
  data: typeof ItemTable.$inferInsert & {
    tags?: string[];
    itemAttributes?: {
      typeAttributeId: string;
      textValue?: string;
      numericValue?: string;
      duplicate?: boolean;
      dataType?: string;
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
      createItemTags(
        trx,
        data.tags.length,
        data.tags.map((tag) => ({
          itemId: newItem.id,
          tagId: tag,
        }))
      );
    }

    if (data.itemAttributes && data.itemAttributes.length > 0) {
      createItemAttributes(
        trx,
        data.itemAttributes.length,
        data.itemAttributes.map((itemAttribute) => ({
          typeAttributeId: itemAttribute.typeAttributeId,
          itemId: newItem.id,
          textValue: itemAttribute.textValue ?? null,
          numericValue: Number(itemAttribute.numericValue) ?? null,
        }))
      );
    }

    if (data.containerItems && data.containerItems.length > 0) {
      createContainerItems(
        trx,
        data.containerItems.length,
        data.containerItems.map((containerItem) => ({
          containerId: containerItem.containerId,
          itemId: newItem.id,
          quantity: containerItem.quantity,
        }))
      );
    }

    if (data.itemImages && data.itemImages.length > 0) {
      createItemImages(
        trx,
        data.itemImages.length,
        data.itemImages.map((imageId, index) => ({
          imageId: imageId,
          itemId: newItem.id,
          imageOrder: index,
        }))
      );
    }

    return newItem;
  });

  if (newItem == null) throw new Error("Failed to create item");

  revalidateItemCache(newItem.id);
}

export async function insertDuplicateItems(
  data: typeof ItemTable.$inferInsert & {
    tags?: string[];
    itemAttributes?: {
      typeAttributeId: string;
      textValue?: string;
      numericValue?: string;
      duplicate?: boolean;
      dataType?: string;
    }[];
    itemImages?: string[];
    containerItems?: {
      containerId: string;
      quantity: number;
    }[];
  }
) {
  const newItems = await db.transaction(async (trx) => {
    const attributeValues: {
      dataType: string;
      typeAttributeId: string;
      values: string[];
      index: number;
    }[] = processItemAttributes(data.itemAttributes);

    if (attributeValues.length === 0)
      throw new Error("Attributes should be present");

    const total = getTotal(attributeValues);

    console.log(total);

    const newItems = await trx
      .insert(ItemTable)
      .values([...Array(total)].map(() => data))
      .returning({ id: ItemTable.id })
      .then((row) => row.map((obj) => obj.id));

    if (newItems == null) trx.rollback();

    if (data.itemAttributes && data.itemAttributes.length > 0) {
      const values = newItems
        .map((itemId) =>
          createDuplicateItemAttributes(attributeValues, 0, itemId, [])
        )
        .flat();

      createItemAttributes(trx, data.itemAttributes.length, values);
    }

    if (data.tags && data.tags.length > 0) {
      createItemTags(
        trx,
        data.tags.length,
        data.tags
          .map((tag) =>
            newItems.map((itemId) => ({
              itemId,
              tagId: tag,
            }))
          )
          .flat()
      );
    }

    if (data.containerItems && data.containerItems.length > 0) {
      createContainerItems(
        trx,
        data.containerItems.length,
        data.containerItems
          .map((containerItem) =>
            newItems.map((itemId) => ({
              containerId: containerItem.containerId,
              itemId,
              quantity: containerItem.quantity,
            }))
          )
          .flat()
      );
    }

    if (data.itemImages && data.itemImages.length > 0) {
      createItemImages(
        trx,
        data.itemImages.length,
        data.itemImages
          .map((imageId, index) =>
            newItems.map((itemId) => ({
              imageId: imageId,
              itemId,
              imageOrder: index,
            }))
          )
          .flat()
      );
    }

    return newItems;
  });

  if (newItems == null) throw new Error("Failed to create item");

  newItems.map((itemId) => revalidateItemCache(itemId));
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
      .onConflictDoNothing({
        target: [ItemImageTable.itemId, ItemImageTable.imageId],
      })
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

export async function addItemImages(
  id: string,
  imageIds: string[],
  containerId: string
) {
  const { updatedItemImages, deletedContainerImages } = await db.transaction(
    async (trx) => {
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
        .onConflictDoUpdate({
          set: { updatedAt: new Date() },
          target: [ItemImageTable.itemId, ItemImageTable.imageId],
        })
        .returning({
          id: ItemImageTable.id,
          itemId: ItemImageTable.itemId,
          imageId: ItemImageTable.imageId,
        });

      if (itemImages.length === 0) {
        trx.rollback();
        throw new Error("Failed to create images");
      }

      const deletedContainerImages = await trx
        .delete(ContainerImageTable)
        .where(
          and(
            eq(ContainerImageTable.containerId, containerId),
            inArray(ContainerImageTable.imageId, imageIds)
          )
        )
        .returning({
          id: ContainerImageTable.id,
          containerId: ContainerImageTable.containerId,
          imageId: ContainerImageTable.imageId,
        });

      if (deletedContainerImages == null)
        throw new Error("Failed to delete image");

      return { updatedItemImages: itemImages, deletedContainerImages };
    }
  );

  updatedItemImages.forEach(({ id, itemId, imageId }) =>
    revalidateItemImageCache(id, itemId, imageId)
  );

  deletedContainerImages.forEach(({ id, containerId, imageId }) => {
    revalidateContainerImageCache(id, containerId, imageId);
  });
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

export async function updateContainerItems(
  id: string,
  updatedContainerItems: {
    quantity: number;
    itemId?: string;
    containerId?: string;
  }[]
) {
  const containerItems = await db.transaction(async (trx) => {
    const containerItems = await trx
      .insert(ContainerItemTable)
      .values(
        updatedContainerItems
          .filter((updatedContainerItem) => updatedContainerItem.containerId)
          .map((updatedContainerItem) => ({
            itemId: id,
            containerId: updatedContainerItem.containerId!,
            quantity: updatedContainerItem.quantity,
          }))
      )
      .onConflictDoUpdate({
        target: [ContainerItemTable.itemId, ContainerItemTable.containerId],
        set: { quantity: sql`excluded.quantity` },
      })
      .returning();

    await trx.delete(ContainerItemTable).where(
      and(
        eq(ContainerItemTable.itemId, id),
        notExists(
          db
            .select()
            .from(
              sql`(values ${sql.join(
                updatedContainerItems.map(
                  (updatedContainerItem) =>
                    sql`(${updatedContainerItem.containerId}::uuid)`
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

    if (containerItems == null)
      throw new Error("Failed to put items into their containers");

    return containerItems;
  });

  containerItems.forEach(({ itemId, containerId }) => {
    revalidateContainerCache(containerId);
    revalidateItemCache(itemId);
  });

  return containerItems;
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
