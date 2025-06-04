type CACHE_TAG =
  | "containers"
  | "items"
  | "containerItems"
  | "itemTypes"
  | "tags"
  | "containerImages"
  | "itemImages"
  | "settings"
  | "typeAttributes"
  | "users"
  | "images"
  | "itemImages"
  | "itemTags"
  | "itemAttributes";

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const;
}

export function getItemTag(tag: CACHE_TAG, itemId: string) {
  return `item:${itemId}-${tag}` as const;
}

export function getContainerTag(tag: CACHE_TAG, containerId: string) {
  return `container:${containerId}-${tag}` as const;
}

export function getItemTypeTag(tag: CACHE_TAG, itemTypeId: string) {
  return `itemType:${itemTypeId}-${tag}`;
}
