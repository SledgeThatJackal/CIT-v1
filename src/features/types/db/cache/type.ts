import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getTypeGlobalTag() {
  return getGlobalTag("itemTypes");
}

export function getTypeIdTag(id: string) {
  return getIdTag("itemTypes", id);
}

export function revalidateTypeCache(id: string) {
  revalidateTag(getTypeGlobalTag());
  revalidateTag(getTypeIdTag(id));
}
