import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getItemGlobalTag } from "../db/cache/item";

export async function getItems() {
  "use cache";

  cacheTag(getItemGlobalTag());
}
