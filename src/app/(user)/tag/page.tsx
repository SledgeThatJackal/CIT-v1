import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import CreateTagButton from "@/features/tags/components/CreateTagButton";
import TagTable from "@/features/tags/components/TagTable";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function generateMetadata(): Promise<Metadata> {
  const total = (await getTags()).length;

  return {
    title: `Tags | ${total} Tag${total !== 1 ? "s" : ""}`,
  };
}

export default async function Tag() {
  const tags = await getTags();

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Tags">
        <CreateTagButton />
      </PageHeader>

      <TagTable tags={tags} />
    </div>
  );
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
