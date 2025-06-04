import { db } from "@/drizzle/db";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { ParentContainerType } from "@/features/containers/schema/containers";
import { sql } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { NextRequest, NextResponse } from "next/server";

async function getParentContainers(id: string, isArea: boolean = false) {
  "use cache";

  cacheTag(getContainerGlobalTag());

  const query = sql`
      WITH RECURSIVE DESCENDANTS AS ( 
        SELECT id 
        FROM containers 
        WHERE id = ${id}
        UNION ALL
        SELECT c.id FROM containers c
        INNER JOIN descendants d ON c."parentId" = d.id
      )
      SELECT id, name, "barcodeId", "isArea" FROM containers c
      WHERE (${isArea} = false OR c."isArea" = true)
      AND c.id NOT IN (SELECT id FROM descendants)
      ORDER BY c.name
    `;

  return (await db.execute(query)).rows as ParentContainerType[];
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
    const containers = await getParentContainers(String(id), Boolean(isArea));
    return NextResponse.json({ parentContainers: containers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch containers" },
      { status: 400 }
    );
  }
}
