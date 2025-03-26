"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  deleteContainer as deleteContainerDb,
  insertContainer,
  updateContainer as updateContainerDb,
  updateImageOrders as updateImageOrdersDb,
} from "../db/containers";
import {
  canCreateContainer,
  canDeleteContainer,
  canUpdateContainer,
  canUpdateContainerImage,
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

export async function updateContainer(
  id: string,
  rawData: CreateContainerType
) {
  const { success, data } = createContainerSchema.safeParse(rawData);

  if (!success || !canUpdateContainer(await getCurrentUser()))
    return new Error("There was an error updating your container");

  const container = await updateContainerDb(id, data);

  return {
    message: `Successfully updated your container: ${container.name} (${container.barcodeId})`,
  };
}

export async function updateImageOrders(imageIds: string[]) {
  if (imageIds.length === 0 || !canUpdateContainerImage(await getCurrentUser()))
    return new Error("There was an error updating your image order");

  await updateImageOrdersDb(imageIds);

  return {
    message: `Successfully reordered your images`,
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
