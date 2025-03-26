import { db } from "@/drizzle/db";
import { ContainerImageTable, ContainerTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateContainerCache } from "./cache/containers";
import { revalidateContainerImageCache } from "@/features/images/db/cache/images";

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

    if (data.containerImages) {
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

export async function updateImageOrders(ids: string[]) {
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

export async function deleteContainer(id: string) {
  const [deletedContainer] = await db
    .delete(ContainerTable)
    .where(eq(ContainerTable.id, id))
    .returning();

  if (deletedContainer == null) throw new Error("Failed to delete container");

  revalidateContainerCache(id);

  return deletedContainer;
}
