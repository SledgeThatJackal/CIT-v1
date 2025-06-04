import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const parts = pathname.split("/");

    const id = decodeURIComponent(parts[parts.length - 1]!);

    if (id == null) throw new Error();

    const imagePath = path.resolve("./uploads/images", id);

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
