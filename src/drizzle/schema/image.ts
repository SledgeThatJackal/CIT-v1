import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { ContainerImageTable } from "./containerImage";
import { ItemImageTable } from "./itemImage";

export const ImageTable = pgTable("images", {
  id,
  fileName: text().notNull().unique(),
  createdAt,
  updatedAt,
});

export const ImageRelationships = relations(ImageTable, ({ many }) => ({
  containerImages: many(ContainerImageTable),
  itemImages: many(ItemImageTable),
}));
