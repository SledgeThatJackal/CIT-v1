"use server";

import { getCurrentUser } from "@/services/clerk";
import { canUpdateSettings } from "../permissions/settings";
import { settingsSchema, SettingsType } from "../schema/settings";
import { updateSettings as updateSettingsDb } from "../db/settings";

export async function updateSettings(rawData: SettingsType) {
  const { success, data } = settingsSchema.safeParse(rawData);

  if (!success || !canUpdateSettings(await getCurrentUser()))
    return new Error("There was an error updating your setting");

  const setting = await updateSettingsDb(data);

  return {
    message: `Successfully updated setting: ${setting.key}`,
  };
}
