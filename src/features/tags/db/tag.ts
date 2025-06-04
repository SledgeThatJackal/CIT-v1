import { db } from "@/drizzle/db";
import { TagTable } from "@/drizzle/schema";
import { revalidateTagCache } from "./cache/tag";
import { eq } from "drizzle-orm";

export async function insertTag(data: typeof TagTable.$inferInsert) {
  const [newTag] = await db.insert(TagTable).values(data).returning();

  if (newTag == null) throw new Error("Failed to create tag");

  revalidateTagCache(newTag.id);

  return newTag;
}

export async function updateTag(
  id: string,
  data: typeof TagTable.$inferInsert
) {
  const [updatedTag] = await db
    .update(TagTable)
    .set(data)
    .where(eq(TagTable.id, id))
    .returning();

  if (updatedTag == null) throw new Error("Failed to update tag");

  revalidateTagCache(updatedTag.id);

  return updatedTag;
}

export async function deleteTag(id: string) {
  const [deletedTag] = await db
    .delete(TagTable)
    .where(eq(TagTable.id, id))
    .returning();

  if (deletedTag == null) throw new Error("Failed to delete tag");

  revalidateTagCache(deletedTag.id);

  return deletedTag;
}
