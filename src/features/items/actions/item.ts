"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  canCreateItem,
  canDeleteItem,
  canUpdateItem,
  canUpdateItemImage,
} from "../permissions/item";
import {
  deleteItem as deleteItemDb,
  insertItem,
  insertItemImages,
  updateItem as updateItemDb,
  updateItemImageOrders as updateItemImageOrdersDb,
  deleteItemImage as deleteItemImageDb,
  updateItemType as updateItemTypeDb,
  updateItemTags as updateItemTagsDb,
  updateContainerItems as updateContainerItemsDb,
  addItemImages as addItemImagesDb,
} from "../db/item";
import { createItemSchema, CreateItemType } from "../schema/item";
import {
  canCreateImage,
  canDeleteImage,
} from "@/features/images/permissions/images";
import { canUpdateTag } from "@/features/tags/permissions/tag";
import {
  canUpdateContainer,
  canUpdateContainerImage,
} from "@/features/containers/permissions/container";

export async function createItem(rawData: CreateItemType) {
  const { success, data } = createItemSchema.safeParse(rawData);

  if (!success || !canCreateItem(await getCurrentUser()))
    return new Error("There was an error creating your item");

  const item = await insertItem(data);

  return {
    message: `Successfully created your item: ${item.name}`,
  };
}

export async function createItemImages(id: string, imageIds: string[]) {
  const user = await getCurrentUser();
  if (!canCreateImage(user) || !canCreateItem(user))
    return new Error("There was an error creating your images");

  await insertItemImages(id, imageIds);

  return {
    message: "Successfully created your images",
  };
}

export async function addItemImages(
  id: string,
  imageIds: string[],
  containerId: string
) {
  const user = await getCurrentUser();

  if (!canUpdateItemImage(user) || !canUpdateContainerImage(user))
    return new Error("There was an error updating your item");

  await addItemImagesDb(id, imageIds, containerId);

  return {
    message: `Successfully updated your item`,
  };
}

export async function updateItem(id: string, rawData: CreateItemType) {
  const { success, data } = createItemSchema.safeParse(rawData);

  if (!success || !canUpdateItem(await getCurrentUser()))
    return new Error("There was an error updating your item");

  const item = await updateItemDb(id, data);

  return {
    message: `Successfully updated your item: ${item.name}`,
  };
}

export async function updateItemImageOrders(imageIds: string[]) {
  if (imageIds.length === 0 || !canUpdateItemImage(await getCurrentUser()))
    return new Error("There was an error updating your image order");

  await updateItemImageOrdersDb(imageIds);

  return {
    message: `Successfully reordered your images`,
  };
}

export async function updateItemType(id: string, itemTypeId: string) {
  if (!canUpdateItem(await getCurrentUser()))
    return new Error("There was an error updating your item");

  await updateItemTypeDb(id, itemTypeId);

  return {
    message: `Successfully changed type`,
  };
}

export async function updateItemTags(id: string, tagIds: string[]) {
  const user = await getCurrentUser();
  if (!canUpdateItem(user) || !canUpdateTag(user))
    return new Error("There was an error updating your tags");

  await updateItemTagsDb(id, tagIds);

  return {
    message: `Successfully updated your tags`,
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

export async function deleteItem(id: string) {
  if (!canDeleteItem(await getCurrentUser()))
    return new Error("There was an error deleting your item");

  await deleteItemDb(id);

  return {
    message: "Successfully deleted item",
  };
}

export async function deleteItemImage(id: string) {
  const user = await getCurrentUser();
  if (!canDeleteItem(user) || !canDeleteImage(user))
    return new Error("There was an error deleting your image");

  await deleteItemImageDb(id);

  return {
    message: "Successfully deleted image",
  };
}
