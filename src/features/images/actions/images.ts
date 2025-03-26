"use server";

import { getCurrentUser } from "@/services/clerk";
import { canCreateImage } from "../permissions/images";
import { insertImages } from "../db/images";

export async function createImages(fileNames: { fileName: string }[]) {
  if (fileNames.length === 0 || !canCreateImage(await getCurrentUser()))
    return new Error("There was an error creating your images");

  const images = await insertImages(fileNames);

  return images;
}
