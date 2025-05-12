import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import {
  ContainerImageTable,
  ContainerTable,
  ImageTable,
} from "@/drizzle/schema";
import ContainerDataTable from "@/features/containers/components/ContainerDataTable";
import CreateContainerButton from "@/features/containers/components/CreateContainerButton";
import { ContainerContextProvider } from "@/features/containers/data/ContainerContextProvider";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { ContainerType } from "@/features/containers/schema/containers";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export default async function ContainerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = (await searchParams).filters;

  const containerData = await getContainers();
  const images = await getImages();

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div className="text-xl">No containers found</div>}>
        <ContainerContextProvider
          images={images}
          containers={containerData}
          parentContainers={containerData}
        >
          <PageHeader title="Containers">
            <CreateContainerButton />
          </PageHeader>
          <ContainerDataTable containers={containerData} />
        </ContainerContextProvider>
      </Suspense>
    </div>
  );
}

export async function getContainers() {
  "use cache";

  cacheTag(getContainerGlobalTag());

  const ParentContainer = alias(ContainerTable, "parent");

  const rows = db
    .select({
      id: ContainerTable.id,
      name: ContainerTable.name,
      description: ContainerTable.description,
      barcodeId: ContainerTable.barcodeId,
      isArea: ContainerTable.isArea,
      createdAt: ContainerTable.createdAt,
      updatedAt: ContainerTable.updatedAt,
      parent: {
        id: ParentContainer.id,
        name: ParentContainer.name,
        barcodeId: ParentContainer.barcodeId,
        isArea: ParentContainer.isArea,
      },
      containerImage: {
        id: ContainerImageTable.id,
        imageId: ImageTable.id,
        fileName: ImageTable.fileName,
        imageOrder: ContainerImageTable.imageOrder,
      },
    })
    .from(ContainerTable)
    .leftJoin(ParentContainer, eq(ContainerTable.parentId, ParentContainer.id))
    .leftJoin(
      ContainerImageTable,
      eq(ContainerImageTable.containerId, ContainerTable.id)
    )
    .leftJoin(ImageTable, eq(ImageTable.id, ContainerImageTable.imageId))
    .orderBy(asc(ContainerTable.name));

  const containers = new Map<string, ContainerType>();

  (await rows).forEach((row) => {
    if (!containers.has(row.id)) {
      containers.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        barcodeId: row.barcodeId,
        isArea: row.isArea,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        parent: row.parent,
        containerImages: [],
      });
    }

    const container = containers.get(row.id);

    if (row.containerImage.id) {
      container?.containerImages.push({
        id: row.containerImage.id,
        imageOrder: row.containerImage.imageOrder ?? 0,
        image: {
          id: row.containerImage.imageId ?? "",
          fileName: row.containerImage.fileName ?? "",
        },
      });
    }
  });

  return Array.from(containers.values());
}

export async function getImages() {
  "use cache";

  cacheTag(getImageGlobalTag());

  return await db.query.ImageTable.findMany({
    columns: {
      id: true,
      fileName: true,
    },
  });
}
