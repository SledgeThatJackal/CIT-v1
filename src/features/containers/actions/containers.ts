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
  updateContainerImageOrders as updateContainerImageOrdersDb,
  updateContainerItems as updateContainerItemsDb,
  updateDescendants as updateDescendantsDb,
  deleteContainerImagesFromIds as deleteContainerImagesFromIdsDb,
  bulkInsertContainers,
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
import { canUpdateItem } from "@/features/items/permissions/item";

export async function createContainer(rawData: CreateContainerType) {
  const { success, data } = createContainerSchema.safeParse(rawData);

  if (!success || !canCreateContainer(await getCurrentUser()))
    return new Error("There was an error creating your container");

  const container = await insertContainer(data);

  return {
    message: `Successfully created your container: ${container.name} (${container.barcodeId})`,
  };
}

export async function bulkCreateContainers(data: Map<string, string[]>) {
  const user = await getCurrentUser();

  if (!canCreateContainer(user) || !canCreateImage(user))
    return new Error("There was an error creating your container");

  await bulkInsertContainers(data);

  return {
    message: `Successfully created your container(s)`,
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

export async function updateContainerImageOrders(imageIds: string[]) {
  if (imageIds.length === 0 || !canUpdateContainerImage(await getCurrentUser()))
    return new Error("There was an error updating your image order");

  await updateContainerImageOrdersDb(imageIds);

  return {
    message: `Successfully reordered your images`,
  };
}

export async function updateContainerItems(
  id: string,
  updatedContainerItems: {
    quantity: number;
    itemId?: string;
    containerId?: string;
  }[]
) {
  const user = await getCurrentUser();

  if (!canUpdateItem(user) || !canUpdateContainer(user))
    return new Error("There was an error updating your ContainerItems");

  await updateContainerItemsDb(id, updatedContainerItems);

  return {
    message: `Successfully updated your ContainerItems`,
  };
}

export async function updateDescendants(id: string, descendants: string[]) {
  if (!canUpdateContainer(await getCurrentUser()))
    return new Error("There was an error updating your ContainerItems");

  await updateDescendantsDb(id, descendants);

  return {
    message: `Successfully updated descendants`,
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

export async function deleteContainerImagesFromIds(
  containerId: string,
  imageIds: string[]
) {
  const user = await getCurrentUser();
  if (!canDeleteContainer(user) || !canDeleteImage(user))
    return new Error("There was an error deleting your image");

  await deleteContainerImagesFromIdsDb(containerId, imageIds);

  return {
    message: "Successfully deleted image",
  };
}
