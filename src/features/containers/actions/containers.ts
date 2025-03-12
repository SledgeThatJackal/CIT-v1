"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  insertContainer,
  deleteContainer as deleteContainerDb,
} from "../db/containers";
import {
  canCreateContainer,
  canDeleteContainer,
} from "../permissions/container";
import {
  createContainerSchema,
  CreateContainerType,
} from "../schema/containers";

export async function createContainer(rawData: CreateContainerType) {
  const { success, data } = createContainerSchema.safeParse(rawData);

  if (!success || !canCreateContainer(await getCurrentUser()))
    return new Error("There was an error creating your container");

  const container = await insertContainer(data);

  return {
    message: `Successfully created your container: ${container.name} (${container.barcodeId})`,
  };
}

export async function deleteContainer(id: string) {
  if (!canDeleteContainer(await getCurrentUser()))
    return new Error("There was an error deleting your container");

  await deleteContainerDb(id);

  return {
    message: "Successfully deleted container",
  };
}
