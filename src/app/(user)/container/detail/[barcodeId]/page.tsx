import DetailTabs from "@/components/detail/DetailTabs";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import {
  ContainerImageTable,
  ContainerItemTable,
  ContainerTable,
} from "@/drizzle/schema";
import ContainerForm from "@/features/containers/components/ContainerForm";
import { getContainerIdTag } from "@/features/containers/db/cache/containers";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { getContainers, getImages } from "../../page";
import { ContainerContextProvider } from "@/features/containers/data/ContainerContextProvider";
import ContainerDetailTab from "@/features/containers/components/ContainerDetailTab";
import { fetchIdFromBarcode } from "@/features/containers/db/containers";
import { Metadata } from "next";
import { Suspense } from "react";

type MetadataProps = {
  params: Promise<{ barcodeId: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { barcodeId } = await params;

  const container = await getContainer(barcodeId);

  return {
    title: container.name,
    description: container.description,
  };
}

export type DetailContainerType = {
  id: string;
  name: string;
  description: string;
  parentId: string;
  barcodeId: string;
  isArea: boolean;
  createdAt: string;
  updatedAt: string;
  containerImages: {
    imageOrder: number;
    id: string;
    image: {
      id: string;
      fileName: string;
    };
  }[];
  containerItems: {
    id: string;
    itemId: string;
    quantity: number;
  }[];
  parent: {
    id: string;
    name: string;
    barcodeId: string;
  } | null;
};

type Props = {
  params: Promise<{ barcodeId: string }>;
};

export default function DetailPage(props: Props) {
  return (
    <div className="container mx-auto py-10">
      <Suspense>
        <SuspendedPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const { barcodeId } = await params;
  const container = await getContainer(barcodeId);

  const images = await getImages();
  const containers = await getContainers();

  const values = ["details", "edit"] as const;

  return (
    <>
      <PageHeader title={container.name} />
      <DetailTabs values={values}>
        <TabsContent value={values[0]}>
          <ContainerDetailTab container={container} />
        </TabsContent>
        <TabsContent value={values[1]}>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg text-bold">
                Editing {container.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContainerContextProvider images={images} containers={containers}>
                <ContainerForm container={container} />
              </ContainerContextProvider>
            </CardContent>
          </Card>
        </TabsContent>
      </DetailTabs>
    </>
  );
}

async function getContainer(barcodeId: string) {
  "use cache";

  const id = await fetchIdFromBarcode(barcodeId);

  if (id == null) throw new Error("Provided barcode does not exist");

  cacheTag(getContainerIdTag(id));

  const container = await db.query.ContainerTable.findFirst({
    where: eq(ContainerTable.id, id),
    with: {
      containerImages: {
        orderBy: asc(ContainerImageTable.imageOrder),
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
      parent: {
        columns: {
          id: true,
          name: true,
          barcodeId: true,
        },
      },
    },
  });

  if (container == null) return notFound();

  return {
    ...container,
    description: container?.description ?? "",
    parentId: container?.parentId ?? "",
    containerImages: container.containerImages
      .filter((image) => image)
      .map((containerImage) => {
        return {
          ...containerImage,
          imageOrder: containerImage.imageOrder ?? 0,
        };
      }),
    createdAt: container.createdAt.toLocaleString(),
    updatedAt: container.updatedAt.toLocaleString(),
  };
}
