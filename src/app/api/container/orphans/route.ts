import { db } from "@/drizzle/db";
import { ContainerTable } from "@/drizzle/schema";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { and, eq, isNull, ne } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { NextRequest, NextResponse } from "next/server";

async function getOrphans(id: string, isArea: boolean) {
  "use cache";

  cacheTag(getContainerGlobalTag());

  return db.query.ContainerTable.findMany({
    columns: {
      id: true,
      barcodeId: true,
      name: true,
    },
    where: and(
      isNull(ContainerTable.parentId),
      ne(ContainerTable.id, id),
      isArea ? undefined : eq(ContainerTable.isArea, false)
    ),
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const isArea: boolean = searchParams.get("isArea") === "true";

  if (!id)
    return NextResponse.json(
      { error: "Missing 'id' parameter" },
      { status: 400 }
    );

  try {
    const orphancontainers = await getOrphans(id, isArea);
    return NextResponse.json(
      { orphanContainers: orphancontainers },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch containers" },
      { status: 400 }
    );
  }
}
