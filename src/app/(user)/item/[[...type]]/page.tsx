import { getImages } from "@/app/admin/container/page";
import {
  getContainers,
  getItems,
  getTags,
  getTypes,
} from "@/app/admin/item/[[...type]]/page";
import ItemDataTable from "@/features/items/components/ItemDataTable";
import { ItemContextProvider } from "@/features/items/data/ItemContextProvider";
import { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ type?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = (await params).type?.[0];

  const total = (await getItems(type)).length;

  const title = `${
    type !== undefined ? type + " Table" : "Item Table"
  } | ${total} Items`;

  return {
    title,
    description: "A table display either all or specific items",
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ type?: string[] }>;
}) {
  const type = (await params).type?.[0];

  const itemData = await getItems(type);
  const images = await getImages();
  const types = await getTypes();
  const tags = await getTags();
  const containers = await getContainers();

  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="text-2xl font-bold text-center">No items found</div>
        }
      >
        <ItemContextProvider
          images={images}
          tags={tags}
          types={types}
          containers={containers}
        >
          <ItemDataTable items={itemData} type={type} url="/admin/item" />
        </ItemContextProvider>
      </Suspense>
    </div>
  );
}
