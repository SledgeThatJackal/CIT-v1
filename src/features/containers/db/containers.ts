import { db } from "@/drizzle/db";
import {
  ContainerImageTable,
  ContainerItemTable,
  ContainerTable,
  ImageTable,
} from "@/drizzle/schema";
import { revalidateContainerImageCache } from "@/features/images/db/cache/images";
import { revalidateItemCache } from "@/features/items/db/cache/item";
import {
  and,
  eq,
  ExtractTablesWithRelations,
  max,
  notExists,
  sql,
} from "drizzle-orm";
import { revalidateContainerCache } from "./cache/containers";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

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

export async function bulkInsertContainers(data: Map<string, string[]>) {
  const newContainerIds = await db.transaction(async (trx) => {
    const containerIds: string[] = [];

    for (const [barcodeId, fileNames] of data) {
      const containerId = await trx
        .insert(ContainerTable)
        .values({ name: barcodeId, barcodeId, isArea: false })
        .onConflictDoUpdate({
          target: ContainerTable.barcodeId,
          set: { updatedAt: new Date() },
        })
        .returning({ id: ContainerTable.id })
        .then((row) => row[0]!.id);

      if (containerId == null) {
        trx.rollback();
        throw new Error("Failed to create container(s)");
      }

      if (fileNames.length !== 0) {
        const imageIds = await trx
          .insert(ImageTable)
          .values(fileNames.map((fileName) => ({ fileName })))
          .onConflictDoUpdate({
            target: ImageTable.fileName,
            set: { updatedAt: new Date() },
          })
          .returning({ id: ImageTable.id })
          .then((rows) => rows.map((r) => r.id));

        if (imageIds == null || imageIds.length === 0) {
          trx.rollback();
          throw new Error("Failed to create image(s)");
        }

        await createContainerImages(trx, containerId, imageIds);
      }

      containerIds.push(containerId);
    }

    return containerIds;
  });

  newContainerIds.forEach((id) => revalidateContainerCache(id));
}

export async function insertContainerImages(id: string, imageIds: string[]) {
  const containerImages = await db.transaction(async (trx) => {
    return createContainerImages(trx, id, imageIds);
  });

  containerImages.forEach(({ id, containerId, imageId }) => {
    revalidateContainerImageCache(id, containerId, imageId);
  });
}

async function createContainerImages(
  trx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema")
    >
  >,
  id: string,
  imageIds: string[]
) {
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
    .onConflictDoUpdate({
      target: [ContainerImageTable.containerId, ContainerImageTable.imageId],
      set: { updatedAt: new Date() },
    })
    .returning();

  if (containerImages.length === 0) trx.rollback();

  return containerImages;
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

export async function updateDescendants(
  parentId: string,
  descendants: string[]
) {
  const updatedContainers = await Promise.all(
    descendants.map((id) =>
      db
        .update(ContainerTable)
        .set({ parentId })
        .where(eq(ContainerTable.id, id))
        .returning({ id: ContainerTable.id })
    )
  );

  updatedContainers.flat().forEach(({ id }) => {
    revalidateContainerCache(id);
  });

  revalidateContainerCache(parentId);
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

export async function deleteContainerImagesFromIds(
  containerId: string,
  imageIds: string[]
) {
  const deletedContainerImages = await Promise.all(
    imageIds.map((imageId) =>
      db
        .delete(ContainerImageTable)
        .where(
          and(
            eq(ContainerImageTable.containerId, containerId),
            eq(ContainerImageTable.imageId, imageId)
          )
        )
        .returning({
          id: ContainerImageTable.id,
          containerId: ContainerImageTable.containerId,
          imageId: ContainerImageTable.imageId,
        })
    )
  );

  if (deletedContainerImages == null) throw new Error("Failed to delete image");

  deletedContainerImages.flat().forEach(({ id, containerId, imageId }) => {
    revalidateContainerImageCache(id, containerId, imageId);
  });
}
