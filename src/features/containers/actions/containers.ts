"use server";

import {
  canCreateImage,
  canDeleteImage,
} from "@/features/images/permissions/images";
import { getCurrentUser } from "@/services/clerk";
import {
  deleteContainer as deleteContainerDb,
  deleteContainerImages,
  insertContainer,
  insertContainerImages,
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

export async function createContainerImages(id: string, imageIds: string[]) {
  const user = await getCurrentUser();
  if (!canCreateImage(user) || !canCreateContainer(user))
    return new Error("There was an error creating your images");

  await insertContainerImages(id, imageIds);

  return {
    message: "Successfully created your images",
  };
}

export async function updateContainer(
  id: string,
  rawData: CreateContainerType
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { containerImages: _, ...rest } = rawData;

  const { success, data } = createContainerSchema.safeParse(rest);

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

export async function deleteContainerImage(id: string) {
  const user = await getCurrentUser();
  if (!canDeleteContainer(user) || !canDeleteImage(user))
    return new Error("There was an error deleting your image");

  await deleteContainerImages(id);

  return {
    message: "Successfully deleted image",
  };
}
