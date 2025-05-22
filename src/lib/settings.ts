import { getSettingsGlobalTag } from "@/features/settings/db/cache/settings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getSettings() {
  "use cache";

  const { db } = await import("@/drizzle/db");

  cacheTag(getSettingsGlobalTag());

  const rows = await db.query.SettingsTable.findMany({
    columns: {
      id: true,
      key: true,
      value: true,
    },
  });

  return rows.map((row) => ({
    ...row,
    key: row.key ?? "",
    value: row.value ?? "",
  }));
}
