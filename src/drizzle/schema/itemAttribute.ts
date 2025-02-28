import { relations } from "drizzle-orm";
import {
  doublePrecision,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { ItemTable } from "./item";
import { TypeAttributeTable } from "./typeAttribute";

export const ItemAttributeTable = pgTable(
  "item_attributes",
  {
    id,
    typeAttributeId: uuid()
      .notNull()
      .references(() => TypeAttributeTable.id),
    itemId: uuid()
      .notNull()
      .references(() => ItemTable.id),
    textValue: text(),
    numericValue: doublePrecision(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.typeAttributeId, t.itemId)]
);

export const ItemAttributeRelationships = relations(
  ItemAttributeTable,
  ({ one }) => ({
    typeAttribute: one(TypeAttributeTable, {
      fields: [ItemAttributeTable.typeAttributeId],
      references: [TypeAttributeTable.id],
    }),
    item: one(ItemTable, {
      fields: [ItemAttributeTable.itemId],
      references: [ItemTable.id],
    }),
  })
);
