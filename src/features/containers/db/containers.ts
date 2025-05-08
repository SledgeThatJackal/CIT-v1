import { db } from "@/drizzle/db";
import {
  ContainerImageTable,
  ContainerItemTable,
  ContainerTable,
} from "@/drizzle/schema";
import { revalidateContainerImageCache } from "@/features/images/db/cache/images";
import { and, eq, max, notExists, sql } from "drizzle-orm";
import { revalidateContainerCache } from "./cache/containers";
import { revalidateItemCache } from "@/features/items/db/cache/item";

export async function insertContainer(
  data: typeof ContainerTable.$inferInsert & { containerImages?: string[] }
) {
  const newContainer = await db.transaction(async (trx) => {
    const [newContainer] = await trx
      .insert(ContainerTable)
      .values(data)
      .returning();

    if (newContainer == null) {
      trx.rollback();
      throw new Error("Failed to create container");
    }

    if (data.containerImages && data.containerImages.length > 0) {
      await trx.insert(ContainerImageTable).values(
        data.containerImages?.map((imageId, index) => ({
          containerId: newContainer.id,
          imageId,
          imageOrder: index,
        }))
      );
    }

    return newContainer;
  });

  if (newContainer == null) throw new Error("Failed to create container");

  revalidateContainerCache(newContainer.id);

  return newContainer;
}

export async function insertContainerImages(id: string, imageIds: string[]) {
  const containerImages = await db.transaction(async (trx) => {
    const [maxImageOrder] = await trx
      .select({ imageOrder: max(ContainerImageTable.imageOrder) })
      .from(ContainerImageTable)
      .where(eq(ContainerImageTable.id, id));

    const imageOrder = maxImageOrder?.imageOrder ?? 0;

    const containerImages = await trx
      .insert(ContainerImageTable)
      .values(
        imageIds.map((imageId, index) => ({
          containerId: id,
          imageId: imageId,
          imageOrder: imageOrder + index + 1,
        }))
      )
      .returning();

    if (containerImages.length === 0) {
      trx.rollback();
      throw new Error("Failed to create images");
    }

    return containerImages;
  });

  containerImages.forEach(({ id, containerId, imageId }) => {
    revalidateContainerImageCache(id, containerId, imageId);
  });
}

export async function updateContainer(
  id: string,
  data: Partial<typeof ContainerTable.$inferInsert>
) {
  const [updatedContainer] = await db
    .update(ContainerTable)
    .set(data)
    .where(eq(ContainerTable.id, id))
    .returning();

  if (updatedContainer == null) throw new Error("Failed to update container");

  revalidateContainerCache(updatedContainer.id);

  return updatedContainer;
}

export async function updateContainerImageOrders(ids: string[]) {
  const containerImages = await Promise.all(
    ids.map((id, index) =>
      db
        .update(ContainerImageTable)
        .set({ imageOrder: index })
        .where(eq(ContainerImageTable.id, id))
        .returning({
          id: ContainerImageTable.id,
          containerId: ContainerImageTable.containerId,
          imageId: ContainerImageTable.imageId,
        })
    )
  );

  containerImages.flat().forEach(({ id, containerId, imageId }) => {
    revalidateContainerImageCache(id, containerId, imageId);
  });
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
          .filter((updatedContainerItem) => updatedContainerItem.itemId)
          .map((updatedContainerItem) => ({
            itemId: updatedContainerItem.itemId!,
            containerId: id,
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
                    sql`(${updatedContainerItem.itemId}::uuid)`
                ),
                sql`,`
              )}) as new_containeritems(item_id)`
            )
            .where(
              sql`new_containeritems.item_id = ${ContainerItemTable.itemId}`
            )
        )
      )
    );

    if (containerItems == null)
      throw new Error("Failed to add items to container");

    return containerItems;
  });

  containerItems.forEach(({ itemId, containerId }) => {
    revalidateContainerCache(containerId);
    revalidateItemCache(itemId);
  });

  return containerItems;
}

export async function deleteContainer(id: string) {
  const [deletedContainer] = await db
    .delete(ContainerTable)
    .where(eq(ContainerTable.id, id))
    .returning();

  if (deletedContainer == null) throw new Error("Failed to delete container");

  revalidateContainerCache(id);

  return deletedContainer;
}

export async function deleteContainerImages(id: string) {
  const [deletedContainerImage] = await db
    .delete(ContainerImageTable)
    .where(eq(ContainerImageTable.id, id))
    .returning();

  if (deletedContainerImage == null) throw new Error("Failed to delete image");

  revalidateContainerImageCache(
    deletedContainerImage.id,
    deletedContainerImage.containerId,
    deletedContainerImage.imageId
  );

  revalidateContainerCache(deletedContainerImage.containerId);
}
