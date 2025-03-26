import { db } from "@/drizzle/db";
import { ImageTable } from "@/drizzle/schema";
import { revalidateImageCache } from "./db/cache/images";

export async function insertImage(data: typeof ImageTable.$inferInsert) {
  const [newImage] = await db.insert(ImageTable).values(data).returning();

  if (newImage == null) throw new Error("Failed to create image");

  revalidateImageCache(newImage.id);

  return newImage;
}
