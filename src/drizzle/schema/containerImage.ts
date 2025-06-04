import { pgTable, smallint, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { ContainerTable } from "./container";
import { ImageTable } from "./image";
import { relations } from "drizzle-orm";

export const ContainerImageTable = pgTable(
  "container_images",
  {
    id,
    containerId: uuid()
      .notNull()
      .references(() => ContainerTable.id, { onDelete: "cascade" }),
    imageId: uuid()
      .notNull()
      .references(() => ImageTable.id, { onDelete: "cascade" }),
    imageOrder: smallint(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.containerId, t.imageId)]
);

export const ContainerImageRelationships = relations(
  ContainerImageTable,
  ({ one }) => ({
    container: one(ContainerTable, {
      fields: [ContainerImageTable.containerId],
      references: [ContainerTable.id],
    }),
    image: one(ImageTable, {
      fields: [ContainerImageTable.imageId],
      references: [ImageTable.id],
    }),
  })
);
