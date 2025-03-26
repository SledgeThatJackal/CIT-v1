import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const imagePath = path.resolve("./uploads/images", id);

  try {
    if (!fs.existsSync(imagePath))
      return NextResponse.json(
        { message: "Error fetching image" },
        { status: 400 }
      );

    const imageBuffer = fs.readFileSync(imagePath);

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/*",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Error fetching image" },
      { status: 400 }
    );
  }
}
