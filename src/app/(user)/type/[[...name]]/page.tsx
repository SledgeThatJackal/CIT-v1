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

type Props = {
  params: Promise<{ name?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const total = (await getTypes()).length;

  return {
    title: `${name !== undefined ? name : "Types"} | ${total} Type${
      total !== 1 ? "s" : ""
    }`,
  };
}

export default async function Type({
  params,
}: {
  params: Promise<{ name?: string }>;
}) {
  const types = await getTypes();
  const { name } = await params;

  const initialIndex = Math.max(
    0,
    types.findIndex((type) => type.name === name)
  );

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Types">
        <Button variant="secondary" asChild>
          <Link href="/type/create/">New Type</Link>
        </Button>
      </PageHeader>
      <TypeTable types={types} initialIndex={initialIndex} />
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
