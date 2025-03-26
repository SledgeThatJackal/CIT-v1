import { db } from "@/drizzle/db";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { createImages } from "@/features/images/actions/images";

async function getImages() {
  "use cache";

  cacheTag(getImageGlobalTag());

  return await db.query.ImageTable.findMany();
}

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json({ images });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images");

    if (files.length === 0)
      return Response.json(
        { error: "An image was not uploaded." },
        { status: 400 }
      );

    const imageDir = path.join(process.cwd(), "uploads/images");

    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

    const fileNames: { fileName: string }[] = [];

    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(imageDir, file.name);

        fs.writeFileSync(filePath, buffer);

        fileNames.push({ fileName: file.name });
      }
    }

    const images = await createImages(fileNames);

    if (images instanceof Error) throw images;

    return Response.json(
      {
        message: `Successfully created your images: ${images
          .map((image) => image.fileName)
          .join(", ")}`,
        images,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to save image(s)" }, { status: 400 });
  }
}
