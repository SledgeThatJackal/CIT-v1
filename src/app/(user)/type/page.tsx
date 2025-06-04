import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { ItemTypeTable } from "@/drizzle/schema";
import TypeTable from "@/features/types/components/TypeTable";
import { getTypeGlobalTag } from "@/features/types/db/cache/type";
import { DetailedTypeSchema } from "@/features/types/schema/type";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const total = (await getTypes()).length;

  return {
    title: ` | ${total} Type${total !== 1 ? "s" : ""}`,
  };
}

export default async function Type() {
  const types = await getTypes();

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Types">
        <Button variant="secondary" asChild>
          <Link href="/type/create/">New Type</Link>
        </Button>
      </PageHeader>
      <TypeTable types={types} />
    </div>
  );
}

async function getTypes() {
  "use cache";

  cacheTag(getTypeGlobalTag());

  return db.query.ItemTypeTable.findMany({
    with: {
      typeAttributes: true,
    },
    orderBy: ItemTypeTable.name,
  }) as unknown as DetailedTypeSchema[];
}
