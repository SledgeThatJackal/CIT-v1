import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getContainerGlobalTag() {
  return getGlobalTag("containers");
}

export function getContainerIdTag(id: string) {
  return getIdTag("containers", id);
}

export function revalidateContainerCache(id: string) {
  revalidateTag(getContainerGlobalTag());
  revalidateTag(getContainerIdTag(id));
}
