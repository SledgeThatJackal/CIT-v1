import { relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { ItemTypeTable } from "./itemType";
import { ItemAttributeTable } from "./itemAttribute";

export const typeAttributeDataTypes = [
  "string",
  "number",
  "boolean",
  "list",
] as const;
export type TypeAttributeDataType = (typeof typeAttributeDataTypes)[number];
export const typeAttributeDataTypeEnum = pgEnum(
  "type_attribute_data_type",
  typeAttributeDataTypes
);

export const TypeAttributeTable = pgTable(
  "type_attributes",
  {
    id,
    itemTypeId: uuid()
      .notNull()
      .references(() => ItemTypeTable.id),
    displayOrder: integer().notNull(),
    title: text().notNull(),
    dataType: typeAttributeDataTypeEnum().notNull().default("string"),
    textDefaultValue: text(),
    numericDefaultValue: doublePrecision(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.itemTypeId, t.title)]
);

export const TypeAttributeRelationships = relations(
  TypeAttributeTable,
  ({ one, many }) => ({
    itemType: one(ItemTypeTable, {
      fields: [TypeAttributeTable.itemTypeId],
      references: [ItemTypeTable.id],
    }),
    itemAttributes: many(ItemAttributeTable),
  })
);
