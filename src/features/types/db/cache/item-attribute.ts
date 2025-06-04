import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getItemAttributeGlobalTag() {
  return getGlobalTag("itemAttributes");
}

export function getItemAttributeIdTag(id: string) {
  return getIdTag("itemAttributes", id);
}

export function revalidateItemAttributeCache(id: string) {
  revalidateTag(getItemAttributeGlobalTag());
  revalidateTag(getItemAttributeIdTag(id));
}
