import {
  getContainerIdTag,
  revalidateContainerCache,
} from "@/features/containers/db/cache/containers";
import {
  getItemIdTag,
  revalidateItemCache,
} from "@/features/items/db/cache/item";
import {
  getContainerTag,
  getGlobalTag,
  getIdTag,
  getItemTag,
} from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getImageGlobalTag() {
  return getGlobalTag("images");
}

export function getImageIdTag(id: string) {
  return getIdTag("images", id);
}

export function getContainerImageIdTag(id: string) {
  return getIdTag("containerImages", id);
}

export function getContainerImageTag(containerId: string) {
  return getContainerTag("containerImages", containerId);
}

export function getItemImageIdTag(id: string) {
  return getIdTag("itemImages", id);
}

export function getItemImageTag(itemId: string) {
  return getItemTag("itemImages", itemId);
}

export function revalidateImageCache() {
  revalidateTag(getImageGlobalTag());
}

export function revalidateContainerImageCache(
  id: string,
  containerId: string,
  imageId: string
) {
  revalidateTag(getContainerImageIdTag(id));
  revalidateTag(getContainerImageTag(containerId));
  revalidateTag(getImageIdTag(imageId));
  revalidateContainerCache(getContainerIdTag(containerId));
}

export function revalidateItemImageCache(
  id: string,
  itemId: string,
  imageId: string
) {
  revalidateTag(getItemImageIdTag(id));
  revalidateTag(getItemImageTag(itemId));
  revalidateTag(getImageIdTag(imageId));
  revalidateItemCache(getItemIdTag(itemId));
}
