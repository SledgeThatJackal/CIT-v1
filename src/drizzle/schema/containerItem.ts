import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelper";
import { ItemTable } from "./item";
import { ContainerTable } from "./container";
import { relations } from "drizzle-orm";

export const ContainerItemTable = pgTable(
  "container_items",
  {
    id,
    containerId: uuid()
      .notNull()
      .references(() => ContainerTable.id, { onDelete: "cascade" }),
    itemId: uuid()
      .notNull()
      .references(() => ItemTable.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
  },
  (t) => [unique().on(t.containerId, t.itemId)]
);

export const ContainerItemRelationships = relations(
  ContainerItemTable,
  ({ one }) => ({
    container: one(ContainerTable, {
      fields: [ContainerItemTable.containerId],
      references: [ContainerTable.id],
    }),
    item: one(ItemTable, {
      fields: [ContainerItemTable.itemId],
      references: [ItemTable.id],
    }),
  })
);
