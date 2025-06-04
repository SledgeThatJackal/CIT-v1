import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getSettingsGlobalTag() {
  return getGlobalTag("settings");
}

export function getSettingsIdTag(id: string) {
  return getIdTag("settings", id);
}

export function revalidateSettingsCache(id: string) {
  revalidateTag(getSettingsGlobalTag());
  revalidateTag(getSettingsIdTag(id));
}
