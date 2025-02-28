import { pgView, text } from "drizzle-orm/pg-core";

export const imageFindView = pgView("image_find", {
  containerId: text(),
  itemId: text(),
  fileName: text(),
});
