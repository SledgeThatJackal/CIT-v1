import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/ui/custom/search-bar";
import { db } from "@/drizzle/db";
import { ContainerTable, ImageFindView, ItemTable } from "@/drizzle/schema";
import ImageThumbnail from "@/features/images/components/ImageThumbnail";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { count, eq, like, sql, and } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/pg-core";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<{ filters: { key: string; value: string }[] }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <Suspense
          fallback={<CardTitle className="text-xl">No images found</CardTitle>}
        >
          <ImageFindContent searchParams={searchParams} />
        </Suspense>
      </Card>
    </div>
  );
}

async function ImageFindContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;

  const { rows: images, total } = await getImages(params);

  return (
    <CardHeader>
      <CardTitle className="flex mb-2">
        <span>Image Search</span>
        <span className="ms-auto">{`Displaying ${images.length} out of ${total} images`}</span>
      </CardTitle>
      <SearchBar
        props={[
          {
            id: "find-search-containerName",
            label: "Container Name",
          },
          {
            id: "find-search-barcodeId",
            label: "Barcode ID",
          },
          {
            id: "find-search-itemName",
            label: "Item Name",
          },
        ]}
        searchParams={params}
      />
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14 p-0 gap-2">
        {images &&
          images.length > 0 &&
          images.map((image) => (
            <ImageThumbnail
              key={`find-${image.barcodeId}-${image.itemId}-${image.fileName}`}
              image={image}
            />
          ))}
      </CardContent>
    </CardHeader>
  );
}

async function getImages(filters: { [key: string]: string }): Promise<{
  rows: { barcodeId: string; itemId: string; fileName: string }[];
  total: number;
}> {
  "use cache";

  cacheTag(getImageGlobalTag());

  const queryBuilder = new QueryBuilder();

  let query = queryBuilder
    .select({
      barcodeId: ImageFindView.barcodeId,
      itemId: ImageFindView.itemId,
      fileName: ImageFindView.fileName,
    })
    .from(ImageFindView)
    .where(sql`1 = 1`)
    .$dynamic();

  for (const [key, value] of Object.entries(filters)) {
    switch (key) {
      case "find-search-containerName": {
        query = query.innerJoin(
          ContainerTable,
          and(
            eq(ContainerTable.barcodeId, ImageFindView.barcodeId),
            like(ContainerTable.name, value)
          )
        );

        break;
      }
      case "find-search-barcodeId": {
        query = query.where(eq(ImageFindView.barcodeId, value));

        break;
      }
      case "find-search-itemName": {
        query = query.innerJoin(
          ItemTable,
          and(
            eq(ItemTable.id, ImageFindView.itemId),
            like(ItemTable.name, value)
          )
        );

        break;
      }
    }
  }

  const { rows } = await db.execute(query);

  const total = await db
    .select({ count: count() })
    .from(ImageFindView)
    .then((totalRows) => totalRows[0]?.count ?? 0);

  return { rows, total };
}
