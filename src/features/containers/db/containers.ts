import { db } from "@/drizzle/db";
import { ContainerTable } from "@/drizzle/schema";

export async function insertContainer(
  data: typeof ContainerTable.$inferInsert
) {
  const [newContainer] = await db
    .insert(ContainerTable)
    .values(data)
    .returning();

  if (newContainer == null) throw new Error("Failed to create container");

  return newContainer;
}
