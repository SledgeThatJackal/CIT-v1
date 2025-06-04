import { pgTable, smallint, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { ItemTable } from "./item";
import { ImageTable } from "./image";
import { relations } from "drizzle-orm";

export const ItemImageTable = pgTable(
  "item_images",
  {
    id,
    itemId: uuid()
      .notNull()
      .references(() => ItemTable.id, { onDelete: "cascade" }),
    imageId: uuid()
      .notNull()
      .references(() => ImageTable.id, { onDelete: "cascade" }),
    imageOrder: smallint(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.itemId, t.imageId)]
);

export const ItemImageRelationships = relations(ItemImageTable, ({ one }) => ({
  item: one(ItemTable, {
    fields: [ItemImageTable.itemId],
    references: [ItemTable.id],
  }),
  image: one(ImageTable, {
    fields: [ItemImageTable.imageId],
    references: [ImageTable.id],
  }),
}));
