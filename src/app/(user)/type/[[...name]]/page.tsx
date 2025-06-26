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
import { Suspense } from "react";

type MetadataProps = {
  params: Promise<{ name?: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { name } = await params;

  const total = (await getTypes()).length;

  return {
    title: `${name !== undefined ? name : "Types"} | ${total} Type${
      total !== 1 ? "s" : ""
    }`,
  };
}

type Props = {
  params: Promise<{ name?: string }>;
};

export default function Type(props: Props) {
  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Types">
        <Button variant="secondary" asChild>
          <Link href="/type/create/">New Type</Link>
        </Button>
      </PageHeader>
      <Suspense>
        <SuspendedPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const types = await getTypes();
  const { name } = await params;

  const initialIndex = Math.max(
    0,
    types.findIndex((type) => type.name === name)
  );

  return <TypeTable types={types} initialIndex={initialIndex} />;
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
