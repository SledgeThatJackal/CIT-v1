import { getImages } from "@/app/(user)/container/page";
import DetailTabs from "@/components/detail/DetailTabs";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import {
  ContainerItemTable,
  ItemImageTable,
  ItemTable,
} from "@/drizzle/schema";
import ItemForm from "@/features/items/components/ItemForm";
import { getItemIdTag } from "@/features/items/db/cache/item";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { getContainers, getTags, getTypes } from "../../[[...type]]/page";
import { ItemContextProvider } from "@/features/items/data/ItemContextProvider";
import ItemDetailTab from "@/features/items/components/ItemDetailTab";
import { Metadata } from "next";

type Props = {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { itemId } = await params;

  const item = await getItem(itemId);

  return {
    title: item.name,
    description: item.description,
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getItem(itemId);

  const images = await getImages();
  const types = await getTypes();
  const tags = await getTags();
  const containers = await getContainers();

  const values = ["details", "edit"] as const;

  return (
    <div className="container mx-auto py-10">
      <PageHeader title={item.name} />
      <DetailTabs values={values}>
        <TabsContent value={values[0]}>
          <ItemDetailTab item={item} />
        </TabsContent>
        <TabsContent value={values[1]}>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg text-bold">
                Editing {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ItemContextProvider
                images={images}
                tags={tags}
                types={types}
                containers={containers}
              >
                <ItemForm item={item} />
              </ItemContextProvider>
            </CardContent>
          </Card>
        </TabsContent>
      </DetailTabs>
    </div>
  );
}

async function getItem(id: string) {
  "use cache";

  cacheTag(getItemIdTag(id));

  const item = await db.query.ItemTable.findFirst({
    where: eq(ItemTable.id, id),
    with: {
      containerItems: {
        orderBy: asc(ContainerItemTable.quantity),
        columns: {
          id: true,
          containerId: true,
          quantity: true,
        },
        with: {
          container: {
            columns: {
              name: true,
              barcodeId: true,
            },
          },
        },
      },
      itemAttributes: {
        columns: {
          id: true,
          typeAttributeId: true,
          textValue: true,
          numericValue: true,
        },
        with: {
          typeAttribute: {
            columns: {
              displayOrder: true,
              title: true,
              dataType: true,
            },
          },
        },
      },
      itemTags: {
        columns: {
          tagId: false,
          itemId: false,
          createdAt: false,
          updatedAt: false,
        },
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
              description: true,
              color: true,
            },
          },
        },
      },
      itemImages: {
        orderBy: asc(ItemImageTable.imageOrder),
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
      itemType: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (item == null) return notFound();

  return {
    ...item,
    description: item.description ?? "",
    externalUrl: item.externalUrl ?? "",
    createdAt: item.createdAt.toLocaleString(),
    updatedAt: item.updatedAt.toLocaleString(),
    tags: item.itemTags.map((itemTag) => {
      return { ...itemTag.tag, description: itemTag.tag.description ?? "" };
    }),
    itemType: { id: item.itemType?.id ?? "", name: item.itemType?.name ?? "" },
    itemAttributes: item.itemAttributes.map((itemAttribute) => {
      return {
        ...itemAttribute,
        textValue: itemAttribute.textValue ?? undefined,
        numericValue: itemAttribute.numericValue ?? undefined,
      };
    }),
    itemImages: item.itemImages
      .filter((image) => image)
      .map((itemImage) => {
        return {
          ...itemImage,
          imageOrder: itemImage.imageOrder ?? 0,
        };
      }),
  };
}
