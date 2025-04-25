import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { ItemTable } from "./item";
import { TypeAttributeTable } from "./typeAttribute";

export const ItemTypeTable = pgTable("item_types", {
  id,
  name: text(),
  updatedAt,
  createdAt,
});

export const ItemTypeRelationships = relations(ItemTypeTable, ({ many }) => ({
  items: many(ItemTable),
  typeAttributes: many(TypeAttributeTable),
}));
