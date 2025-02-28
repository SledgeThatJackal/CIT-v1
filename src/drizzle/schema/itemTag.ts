import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { ItemTable } from "./item";
import { TagTable } from "./tag";
import { createdAt, updatedAt } from "../schemaHelper";

export const ItemTagTable = pgTable(
  "item_tags",
  {
    itemId: uuid()
      .notNull()
      .references(() => ItemTable.id),
    tagId: uuid()
      .notNull()
      .references(() => TagTable.id),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.itemId, t.tagId] })]
);

export const ItemTagRelationships = relations(ItemTagTable, ({ one }) => ({
  item: one(ItemTable, {
    fields: [ItemTagTable.itemId],
    references: [ItemTable.id],
  }),
  tag: one(TagTable, {
    fields: [ItemTagTable.tagId],
    references: [TagTable.id],
  }),
}));
