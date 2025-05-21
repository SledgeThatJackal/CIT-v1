import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingLabel from "@/components/ui/custom/floating-label";
import { db } from "@/drizzle/db";
import { ImageFindView } from "@/drizzle/schema";
import { getImageGlobalTag } from "@/features/images/db/cache/images";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import { count } from "drizzle-orm";

export default async function FindPage() {
  const { rows: images, total } = await getImages();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex mb-2">
            <span>Image Search</span>
            <span className="ms-auto">{`Displaying ${images.length} out of ${total} images`}</span>
          </CardTitle>
          <SearchBar />
          <CardContent className="grid grid-cols-14 p-0 gap-2">
            {images &&
              images.length > 0 &&
              images.map((image) => (
                <div
                  className="bg-table-header p-2 rounded-xl text-center"
                  key={`find-${image.barcodeId}-${image.itemId}-${image.fileName}`}
                >
                  <p className="mb-1 text-sm">{image.barcodeId}</p>
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <Image
                      src={`/api/uploads/images/${image.fileName}`}
                      alt="Random Image"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="h-full w-full rounded object-cover"
                    />
                  </AspectRatio>
                </div>
              ))}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

function SearchBar() {
  return (
    <fieldset className="flex flex-row">
      <FloatingLabel
        id="find-search-containerName"
        label="Container Name"
        className="rounded-l-lg"
      />
      <FloatingLabel id="find-search-barcodeId" label="Barcode ID" />
      <FloatingLabel id="find-search-itemName" label="Item Name" />
      <Button
        className="rounded-none rounded-r-lg hover:cursor-pointer h-11"
        variant="secondary"
      >
        Search
      </Button>
    </fieldset>
  );
}

async function getImages() {
  "use cache";

  cacheTag(getImageGlobalTag());

  const rows = await db.select().from(ImageFindView);
  const total = await db
    .select({ count: count() })
    .from(ImageFindView)
    .then((totalRows) => totalRows[0]?.count);

  return { rows, total };
}
