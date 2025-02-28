import { boolean, foreignKey, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { ContainerItemTable } from "./containerItem";

export const ContainerTable = pgTable(
  "containers",
  {
    id,
    name: text().notNull(),
    description: text(),
    barcodeId: text().unique().notNull(),
    parentId: uuid(),
    isArea: boolean().notNull().default(false),
    createdAt,
    updatedAt,
  },
  (t) => [
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "container_parent_id_fkey",
    }),
  ]
);

export const ContainerRelationships = relations(ContainerTable, ({ many }) => ({
  containerItems: many(ContainerItemTable),
}));
