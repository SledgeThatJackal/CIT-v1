import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ContainerItemTable, ContainerTable } from "@/drizzle/schema";
import ContainerDataTable from "@/features/containers/components/ContainerDataTable";
import CreateContainerButton from "@/features/containers/components/CreateContainerButton";
import { ContainerContextProvider } from "@/features/containers/data/ContainerContextProvider";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { asc } from "drizzle-orm";
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
        <ContainerContextProvider images={images} containers={containerData}>
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

  const rows = await db.query.ContainerTable.findMany({
    orderBy: asc(ContainerTable.name),
    with: {
      parent: {
        columns: {
          id: true,
          name: true,
          barcodeId: true,
          isArea: true,
        },
      },
      containerImages: {
        columns: {
          id: true,
          imageOrder: true,
        },
        with: {
          image: {
            columns: {
              id: true,
              fileName: true,
            },
          },
        },
      },
      containerItems: {
        orderBy: asc(ContainerItemTable.quantity),
        columns: {
          id: true,
          itemId: true,
          quantity: true,
        },
        with: {
          item: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });

  return rows.map((row) => {
    return {
      ...row,
      description: row.description ?? "",
      containerImages: row.containerImages
        .filter((image) => image)
        .map((containerImage) => {
          return {
            ...containerImage,
            imageOrder: containerImage.imageOrder ?? 0,
          };
        }),
      createdAt: row.createdAt.toLocaleString(),
      updatedAt: row.updatedAt.toLocaleString(),
    };
  });
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
