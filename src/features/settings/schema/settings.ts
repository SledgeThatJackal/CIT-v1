import { z } from "zod";

export const settingsSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  key: z.string().min(1, "Required"),
  value: z.string().min(1, "Required"),
});

export type SettingsType = z.infer<typeof settingsSchema>;
