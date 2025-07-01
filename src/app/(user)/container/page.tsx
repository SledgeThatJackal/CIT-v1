import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ContainerItemTable, ContainerTable } from "@/drizzle/schema";
import BulkUploadButton from "@/features/containers/components/BulkUploadButton";
import ContainerDataTable from "@/features/containers/components/ContainerDataTable";
import CreateContainerButton from "@/features/containers/components/CreateContainerButton";
import { ContainerContextProvider } from "@/features/containers/data/ContainerContextProvider";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { asc } from "drizzle-orm";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Container Table",
};

export default function ContainerPage() {
  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="text-2xl font-bold text-center">
            No containers found.
          </div>
        }
      >
        <SuspendedPage />
      </Suspense>
    </div>
  );
}

async function SuspendedPage() {
  const containerData = await getContainers();
  const images = await getImages();

  return (
    <ContainerContextProvider images={images} containers={containerData}>
      <PageHeader title="Containers">
        <div className="flex flex-row gap-2">
          <BulkUploadButton />
          <CreateContainerButton />
        </div>
      </PageHeader>
      <ContainerDataTable containers={containerData} />
    </ContainerContextProvider>
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
