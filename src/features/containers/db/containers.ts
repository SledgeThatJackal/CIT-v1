import { db } from "@/drizzle/db";
import { ContainerTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateContainerCache } from "./cache/containers";

export async function insertContainer(
  data: typeof ContainerTable.$inferInsert
) {
  const [newContainer] = await db
    .insert(ContainerTable)
    .values(data)
    .returning();

  if (newContainer == null) throw new Error("Failed to create container");

  revalidateContainerCache(newContainer.id);

  return newContainer;
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
