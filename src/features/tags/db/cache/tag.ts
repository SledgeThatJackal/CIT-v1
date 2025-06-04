import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getTagGlobalTag() {
  return getGlobalTag("tags");
}

export function getTagIdTag(id: string) {
  return getIdTag("tags", id);
}

export function revalidateTagCache(id: string) {
  revalidateTag(getTagGlobalTag());
  revalidateTag(getTagIdTag(id));
}
