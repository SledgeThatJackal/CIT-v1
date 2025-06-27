import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import CreateTagButton from "@/features/tags/components/CreateTagButton";
import TagTable from "@/features/tags/components/TagTable";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tags",
};

export default function Tag() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Tags">
        <CreateTagButton />
      </PageHeader>

      <Suspense>
        <SuspendedPage />
      </Suspense>
    </div>
  );
}

async function SuspendedPage() {
  const tags = await getTags();

  return <TagTable tags={tags} />;
}

async function getTags() {
  "use cache";

  cacheTag(getTagGlobalTag());

  const rows = await db.query.TagTable.findMany({
    columns: { id: true, name: true, description: true, color: true },
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });

  return rows.map((row) => ({
    ...row,
    description: row.description ?? undefined,
  }));
}
