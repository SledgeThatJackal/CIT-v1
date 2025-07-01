"use server";

import { getCurrentUser } from "@/services/clerk/clerk";
import { canDeleteType } from "../permissions/type";
import { deleteTypeAttribute as deleteTypeAttributeDb } from "../db/type-attribute";

export async function deleteTypeAttribute(id: string) {
  if (!canDeleteType(await getCurrentUser()))
    return new Error("There was an error deleting your attribute");

  const typeAttribute = await deleteTypeAttributeDb(id);

  return {
    message: `Successfully deleted attribute: ${typeAttribute.title}`,
  };
}
