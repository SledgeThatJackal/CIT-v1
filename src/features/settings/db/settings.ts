import { db } from "@/drizzle/db";
import { SettingsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateSettingsCache } from "./cache/settings";

export async function updateSettings({
  key,
  value,
}: Partial<typeof SettingsTable.$inferInsert>) {
  if (!key || !value) throw new Error("Key-Value pair must be defined");

  const [updatedSetting] = await db
    .update(SettingsTable)
    .set({ value })
    .where(eq(SettingsTable.key, key))
    .returning();

  if (updatedSetting == null) throw new Error("Failed to update setting");

  revalidateSettingsCache(updatedSetting.id);

  return updatedSetting;
}
