import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import CreateTagButton from "@/features/tags/components/CreateTagButton";
import TagTable from "@/features/tags/components/TagTable";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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

  return await db.query.TagTable.findMany({
    columns: { id: true, name: true, description: true, color: true },
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });
}
