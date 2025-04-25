import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { ItemTypeTable } from "@/drizzle/schema";
import { getTypeGlobalTag } from "@/features/types/db/cache/type";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export default async function Type() {
  const types = await getTypes();

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Types">
        <Button variant="secondary" asChild>
          <Link href={`/type/create/${types[0]?.id}`}>New Type</Link>
        </Button>
      </PageHeader>
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
  });
}
