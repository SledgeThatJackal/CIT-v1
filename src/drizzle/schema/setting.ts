import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

export const SettingsTable = pgTable("settings", {
  id,
  key: text(),
  value: text(),
  createdAt,
  updatedAt,
});
