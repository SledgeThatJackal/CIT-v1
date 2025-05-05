import DetailTabs from "@/components/detail/DetailTabs";
import { PageHeader } from "@/components/PageHeader";
import { TabsContent } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import { ContainerTable } from "@/drizzle/schema";
import ContainerForm from "@/features/containers/components/ContainerForm";
import { getContainerIdTag } from "@/features/containers/db/cache/containers";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { getContainers } from "../../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ containerId: string }>;
}) {
  const { containerId } = await params;
  const container = await getContainer(containerId);
  const parentContainers = await getContainers();

  const values = ["details", "edit"] as const;

  return (
    <div className="container mx-auto py-10">
      <PageHeader title={container.name} />
      <DetailTabs values={values}>
        <TabsContent value={values[0]}>
          <div>Details</div>
        </TabsContent>
        <TabsContent value={values[1]}>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg text-bold">
                Editing {container.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContainerForm
                container={container}
                parentContainers={parentContainers}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </DetailTabs>
    </div>
  );
}

async function getContainer(id: string) {
  "use cache";

  cacheTag(getContainerIdTag(id));

  const container = await db.query.ContainerTable.findFirst({
    where: eq(ContainerTable.id, id),
  });

  if (container == null) return notFound();

  return {
    ...container,
    description: container?.description ?? "",
    parentId: container?.parentId ?? "",
  };
}
