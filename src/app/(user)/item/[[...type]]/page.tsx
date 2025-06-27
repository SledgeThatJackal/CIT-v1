import { db } from "@/drizzle/db";
import {
  ContainerItemTable,
  ContainerTable,
  ItemImageTable,
  ItemTable,
  ItemTypeTable,
  TagTable,
  TypeAttributeTable,
} from "@/drizzle/schema";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import ItemDataTable from "@/features/items/components/ItemDataTable";
import { ItemContextProvider } from "@/features/items/data/ItemContextProvider";
import { getItemGlobalTag } from "@/features/items/db/cache/item";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { SimpleTypeSchema } from "@/features/types/schema/type";
import { asc, eq } from "drizzle-orm";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";
import { getImages } from "../../container/page";

type MetadataProps = {
  params: Promise<{ type?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const type = (await params).type?.[0];

  const title = `${type !== undefined ? type + " Table" : "Item Table"}`;

  return {
    title,
    description: "A table display either all or specific items",
  };
}

type Props = {
  params: Promise<{ type?: string[] }>;
};

export default function Item(props: Props) {
  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="text-2xl font-bold text-center">No items found</div>
        }
      >
        <SuspendedPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const type = (await params).type?.[0];

  const itemData = await getItems(type);
  const images = await getImages();
  const types = await getTypes();
  const tags = await getTags();
  const containers = await getContainers();

  return (
    <ItemContextProvider
      images={images}
      tags={tags}
      types={types}
      containers={containers}
    >
      <ItemDataTable items={itemData} type={type} />
    </ItemContextProvider>
  );
}

async function getItems(type?: string) {
  "use cache";

  cacheTag(getItemGlobalTag());

  const rows = await db.query.ItemTable.findMany({
    where: type ? eq(ItemTable.itemTypeId, type) : undefined,
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
      itemType: {
        columns: {
          id: true,
          name: true,
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
      itemTags: {
        columns: {
          tagId: true,
        },
        with: {
          tag: {
            columns: {
              createdAt: false,
              updatedAt: false,
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
      externalUrl: row.externalUrl ?? "",
      createdAt: row.createdAt.toLocaleString(),
      updatedAt: row.updatedAt.toLocaleString(),
      tags: row.itemTags.map((itemTag) => {
        return { ...itemTag.tag, description: itemTag.tag.description ?? "" };
      }),
      itemType: { id: row.itemType?.id ?? "", name: row.itemType?.name ?? "" },
      itemAttributes: row.itemAttributes.map((itemAttribute) => {
        return {
          ...itemAttribute,
          textValue: itemAttribute.textValue ?? undefined,
          numericValue: itemAttribute.numericValue ?? undefined,
        };
      }),
      itemImages: row.itemImages
        .filter((image) => image)
        .map((itemImage) => {
          return {
            ...itemImage,
            imageOrder: itemImage.imageOrder ?? 0,
          };
        }),
    };
  });
}

export async function getTags() {
  "use cache";

  cacheTag(getTagGlobalTag());

  const tags = await db.query.TagTable.findMany({
    columns: {
      updatedAt: false,
      createdAt: false,
    },
    orderBy: TagTable.name,
  });

  return tags.map((tag) => {
    return { ...tag, description: tag.description ?? "" };
  });
}

export async function getTypes() {
  "use cache";

  cacheTag();

  const rows = db
    .select({
      id: ItemTypeTable.id,
      name: ItemTypeTable.name,
      typeAttribute: {
        id: TypeAttributeTable.id,
        title: TypeAttributeTable.title,
        displayOrder: TypeAttributeTable.displayOrder,
        dataType: TypeAttributeTable.dataType,
        textDefaultValue: TypeAttributeTable.textDefaultValue,
        numericDefaultValue: TypeAttributeTable.numericDefaultValue,
      },
    })
    .from(ItemTypeTable)
    .leftJoin(
      TypeAttributeTable,
      eq(ItemTypeTable.id, TypeAttributeTable.itemTypeId)
    )
    .orderBy(ItemTypeTable.name);

  const types = new Map<string, SimpleTypeSchema>();

  (await rows).forEach((row) => {
    if (!types.has(row.id)) {
      types.set(row.id, {
        id: row.id,
        name: row.name ?? "",
        typeAttributes: [],
      });
    }

    const type = types.get(row.id);

    if (row.typeAttribute?.id) {
      type?.typeAttributes.push(row.typeAttribute);
    }
  });

  return Array.from(types.values());
}

export async function getContainers() {
  "use cache";

  cacheTag(getContainerGlobalTag());

  return await db.query.ContainerTable.findMany({
    columns: {
      id: true,
      name: true,
      barcodeId: true,
    },
    orderBy: ContainerTable.name,
  });
}
