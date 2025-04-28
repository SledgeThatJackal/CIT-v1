import { db } from "@/drizzle/db";
import { TypeAttributeTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateTypeAttributeCache } from "./cache/type-attribute";

export async function deleteTypeAttribute(id: string) {
  const [deletedTypeAttribute] = await db
    .delete(TypeAttributeTable)
    .where(eq(TypeAttributeTable.id, id))
    .returning();

  if (deletedTypeAttribute == null) throw new Error("Failed to delete type");

  revalidateTypeAttributeCache(id, deletedTypeAttribute.itemTypeId);

  return deletedTypeAttribute;
}
