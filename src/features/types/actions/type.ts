"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  canCreateType,
  canDeleteType,
  canUpdateType,
} from "../permissions/type";
import { formTypeSchema, FormTypeType } from "../schema/type";
import {
  insertType,
  updateType as updateTypeDb,
  deleteType as deleteTypeDb,
} from "../db/type";
import { CreateTypeAttributeType } from "../schema/type-attribute";

export async function createType(rawData: FormTypeType) {
  const { success, data } = formTypeSchema.safeParse(rawData);

  if (!success || !canCreateType(await getCurrentUser()))
    return new Error("There was an error creating your type");

  const type = await insertType(data);

  return {
    message: `Successfully create your type: ${type.name}`,
  };
}

export async function updateType(id: string, rawData: any) {
  const { success, data } = formTypeSchema.safeParse(rawData);

  if (!success || !canUpdateType(await getCurrentUser()))
    return new Error("There was an error updating your type");

  await updateTypeDb(data);

  return {
    message: `Successfully updated your type`,
  };
}

export async function deleteType(id: string) {
  if (!canDeleteType(await getCurrentUser()))
    return new Error("There was an error deleting your type");

  const type = await deleteTypeDb(id);

  return {
    message: `Successfully deleted type: ${type.name}`,
  };
}
