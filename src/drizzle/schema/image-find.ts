import { pgView, text, uuid } from "drizzle-orm/pg-core";

export const ImageFindView = pgView("image_find", {
  barcodeId: text("barcodeId").notNull(),
  itemId: uuid("itemId"),
  fileName: text("fileName").notNull(),
}).existing();
