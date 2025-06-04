import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { ContainerItemTable } from "./containerItem";
import { ItemTypeTable } from "./itemType";
import { ItemImageTable } from "./itemImage";
import { ItemTagTable } from "./itemTag";
import { ItemAttributeTable } from "./itemAttribute";

export const ItemTable = pgTable("items", {
  id,
  name: text().notNull(),
  description: text(),
  externalUrl: text(),
  itemTypeId: uuid().references(() => ItemTypeTable.id, {
    onDelete: "set null",
  }),
  createdAt,
  updatedAt,
});

export const ItemRealtionships = relations(ItemTable, ({ one, many }) => ({
  containerItems: many(ContainerItemTable),
  itemType: one(ItemTypeTable, {
    fields: [ItemTable.itemTypeId],
    references: [ItemTypeTable.id],
  }),
  itemImages: many(ItemImageTable),
  itemTags: many(ItemTagTable),
  itemAttributes: many(ItemAttributeTable),
}));
