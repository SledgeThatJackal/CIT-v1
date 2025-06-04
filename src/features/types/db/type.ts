import { ItemTypeTable, TypeAttributeTable } from "@/drizzle/schema";
import { CreateTypeAttributeType } from "../schema/type-attribute";
import { db } from "@/drizzle/db";
import { revalidateTypeCache } from "./cache/type";
import { eq, sql } from "drizzle-orm";
import { revalidateTypeAttributeCache } from "./cache/type-attribute";

export async function insertType(
  data: typeof ItemTypeTable.$inferInsert & {
    typeAttributes?: CreateTypeAttributeType[];
  }
) {
  const newType = await db.transaction(async (trx) => {
    const [newType] = await trx.insert(ItemTypeTable).values(data).returning();

    if (newType == null) {
      trx.rollback();
      throw new Error("Failed to create type");
    }

    if (data.typeAttributes && data.typeAttributes.length > 0) {
      await trx.insert(TypeAttributeTable).values(
        data.typeAttributes.map((typeAttribute) => ({
          ...typeAttribute,
          itemTypeId: newType.id,
          [typeAttribute.dataType === "string"
            ? "numericDefaultValue"
            : "textDefaultValue"]: undefined,
        }))
      );
    }

    return newType;
  });

  if (newType == null) throw new Error("Failed to create type");

  revalidateTypeCache(newType.id);

  return newType;
}

export async function updateType(
  id: string,
  data: Partial<typeof ItemTypeTable.$inferInsert> & {
    typeAttributes?: Partial<typeof TypeAttributeTable.$inferInsert>[];
  }
) {
  const updatedType = await db.transaction(async (trx) => {
    const [updatedType] = await trx
      .update(ItemTypeTable)
      .set(data)
      .where(eq(ItemTypeTable.id, id))
      .returning();

    if (updatedType == null) {
      trx.rollback();
      throw new Error("Failed to update type");
    }

    if (data.typeAttributes && data.typeAttributes.length > 0) {
      const typeAttributes = await trx
        .insert(TypeAttributeTable)
        .values(
          data.typeAttributes.map((typeAttribute, index) => ({
            ...typeAttribute,
            title: typeAttribute.title ?? "",
            itemTypeId: updatedType.id,
            displayOrder: typeAttribute.displayOrder ?? index + 1,
            numericDefaultValue: typeAttribute.numericDefaultValue ?? null,
            textDefaultValue: typeAttribute.textDefaultValue ?? null,
          }))
        )
        .onConflictDoUpdate({
          target: [TypeAttributeTable.id],
          set: {
            textDefaultValue: sql.raw(`excluded."textDefaultValue"`),
            numericDefaultValue: sql.raw(`excluded."numericDefaultValue"`),
            displayOrder: sql.raw(`excluded."displayOrder"`),
            dataType: sql.raw(`excluded."dataType"`),
            title: sql.raw(`excluded."title"`),
          },
        })
        .returning({
          id: TypeAttributeTable.id,
        });

      typeAttributes.flat().forEach(({ id: attributeId }) => {
        revalidateTypeAttributeCache(attributeId, id);
      });

      return updatedType;
    }
  });

  if (updatedType == null) throw new Error("Failed to update type");

  revalidateTypeCache(updatedType.id);
}

export async function deleteType(id: string) {
  const [deletedType] = await db
    .delete(ItemTypeTable)
    .where(eq(ItemTypeTable.id, id))
    .returning();

  if (deletedType == null) throw new Error("Failed to delete type");

  revalidateTypeCache(id);

  return deletedType;
}
