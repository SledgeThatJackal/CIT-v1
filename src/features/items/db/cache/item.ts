import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getItemGlobalTag() {
  return getGlobalTag("items");
}

export function getItemIdTag(id: string) {
  return getIdTag("items", id);
}

export function revalidateItemCache(id: string) {
  revalidateTag(getItemGlobalTag());
  revalidateTag(getItemIdTag(id));
}
