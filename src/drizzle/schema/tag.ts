import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { ItemTagTable } from "./itemTag";

export const TagTable = pgTable("tags", {
  id,
  name: text().notNull(),
  description: text(),
  color: varchar({ length: 7 }),
  createdAt,
  updatedAt,
});

export const TagRelationships = relations(TagTable, ({ many }) => ({
  itemTags: many(ItemTagTable),
}));
