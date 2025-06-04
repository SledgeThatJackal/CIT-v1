"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ImageThumbnail({
  image,
}: {
  image: {
    barcodeId: string;
    itemId: string | null;
    fileName: string;
  };
}) {
  const router = useRouter();

  return (
    <div
      className="bg-table-header p-2 rounded-xl text-center hover:bg-table-header-hover hover:cursor-pointer"
      onClick={() => router.push(`/container/detail/${image.barcodeId}`)}
    >
      <p className="mb-1 text-sm">{image.barcodeId}</p>
      <AspectRatio ratio={16 / 9} className="bg-transparent">
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
  );
}
