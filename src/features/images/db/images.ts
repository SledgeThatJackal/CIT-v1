import { db } from "@/drizzle/db";
import { ImageTable } from "@/drizzle/schema";
import { revalidateImageCache } from "./cache/images";

export async function insertImages(fileNames: { fileName: string }[]) {
  const images = await db
    .insert(ImageTable)
    .values(fileNames)
    .onConflictDoUpdate({
      target: ImageTable.fileName,
      set: { updatedAt: new Date() },
    })
    .returning();

  if (images == null) throw new Error("Failed to create image(s)");

  revalidateImageCache();

  return images;
}
