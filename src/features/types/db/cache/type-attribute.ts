import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";
import { revalidateTypeCache } from "./type";

export function getTypeAttributeGlobalTag() {
  return getGlobalTag("typeAttributes");
}

export function getTypeAttributeIdTag(id: string) {
  return getIdTag("typeAttributes", id);
}

export function revalidateTypeAttributeCache(id: string, itemTypeId: string) {
  revalidateTag(getTypeAttributeGlobalTag());
  revalidateTag(getTypeAttributeIdTag(id));
  revalidateTypeCache(itemTypeId);
}
