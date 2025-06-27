"use server";

import { getCurrentUser } from "@/services/clerk/clerk";
import {
  deleteTag as deleteTagDb,
  insertTag,
  updateTag as updateTagDb,
} from "../db/tag";
import { canCreateTag, canDeleteTag } from "../permissions/tag";
import { createTagSchema, CreateTagType } from "../schema/tag";

export async function createTag(unsafeData: CreateTagType) {
  const { success, data } = createTagSchema.safeParse(unsafeData);

  if (!success || !canCreateTag(await getCurrentUser()))
    return new Error("There was an error creating your tag");

  const tag = await insertTag(data);

  return {
    message: `Successfully created your tag: $${tag.name}`,
  };
}

export async function updateTag(id: string, unsafeData: CreateTagType) {
  const { success, data } = createTagSchema.safeParse(unsafeData);

  if (!success || !canCreateTag(await getCurrentUser()))
    return new Error("There was an error updating your tag");

  const tag = await updateTagDb(id, data);

  return {
    message: `Successfully updated your tag: $${tag.name}`,
  };
}

export async function deleteTag(id: string) {
  if (!canDeleteTag(await getCurrentUser()))
    return new Error("There was an error deleting your tag");

  await deleteTagDb(id);

  return {
    message: "Successfully deleted tag",
  };
}
