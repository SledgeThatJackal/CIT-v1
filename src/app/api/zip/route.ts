import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { unzipSync } from "fflate";
import { bulkCreateContainers } from "@/features/containers/actions/containers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const zipFile = formData.get("zipFile");

    if (zipFile == null || !(zipFile instanceof File))
      return NextResponse.json(
        { error: "A zip file was not uploaded." },
        { status: 400 }
      );

    const buffer = await zipFile.arrayBuffer();
    const unit8 = new Uint8Array(buffer);

    const files = unzipSync(unit8);

    const containers = new Map<string, string[]>();
    const isImage = (name: string) => /\.(png|jpe?g|gif)$/i.test(name);

    const imageDir = path.join(process.cwd(), "uploads/images");
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

    for (const [fullPath, content] of Object.entries(files)) {
      if (isImage(fullPath)) {
        const parts = fullPath.split("/");
        const fileName = parts.pop()!;
        const barcodeId = parts.pop()!;

        const imageBuffer = Buffer.from(content);
        const filePath = path.join(imageDir, fileName);

        fs.writeFileSync(filePath, imageBuffer);

        if (!containers.has(barcodeId)) {
          containers.set(barcodeId, []);
        }

        containers.get(barcodeId)?.push(fileName);
      }
    }

    await bulkCreateContainers(containers);

    return NextResponse.json(
      { message: "Successfully created containers" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create containers" },
      { status: 400 }
    );
  }
}
