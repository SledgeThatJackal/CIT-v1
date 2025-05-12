"use client";

import { Row } from "@tanstack/react-table";
import { ContainerType } from "../../schema/containers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction, useState } from "react";
import { ImageType } from "@/features/images/schema/images";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tabValues = ["select", "new", "existing"] as const;
type TabType = (typeof tabValues)[number];

export default function CreateItem({ row }: { row: Row<ContainerType> }) {
  const images = row.original.containerImages.map(
    (containerImage) => containerImage.image
  );

  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [value, setValue] = useState<TabType>("select");

  return (
    <Tabs value={value}>
      <TabsList>
        <TabsTrigger
          value="select"
          className="hover:cursor-pointer"
          onClick={() => setValue("select")}
        >
          Select
        </TabsTrigger>
        <TabsTrigger
          value="new"
          className="hover:cursor-pointer"
          onClick={() => setValue("new")}
        >
          New Item
        </TabsTrigger>
        <TabsTrigger
          value="existing"
          className="hover:cursor-pointer"
          onClick={() => setValue("existing")}
        >
          Existing Items
        </TabsTrigger>
      </TabsList>
      <TabsContent value="select">
        <SelectTab
          selectedImages={selectedImages}
          images={images}
          setImages={setSelectedImages}
        />
      </TabsContent>
      <TabsContent value="new">
        <NewTab selectedImages={selectedImages} />
      </TabsContent>
      <TabsContent value="existing">
        <ExisitingTab selectedImages={selectedImages} />
      </TabsContent>
    </Tabs>
  );
}

function SelectTab({
  images,
  selectedImages,
  setImages,
}: {
  images: ImageType[];
  selectedImages: ImageType[];
  setImages: Dispatch<SetStateAction<ImageType[]>>;
}) {
  function handleCheckedChange(image: ImageType) {
    if (selectedImages.includes(image)) {
      setImages((prev) => prev.filter((value) => value !== image));
    } else {
      setImages((prev) => [...prev, image]);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-10">
      {images.map((image) => (
        <Label
          htmlFor={`image-${image.id}`}
          className="relative w-40 bg-accent-alternate p-2 rounded-lg hover:cursor-pointer"
          key={`selectImage-${image.id}`}
        >
          <Checkbox
            className="absolute top-3 left-3"
            id={`image-${image.id}`}
            checked={selectedImages.includes(image)}
            onClick={() => handleCheckedChange(image)}
          />
          <Image
            src={`/api/uploads/images/${image.fileName}`}
            alt={image.fileName}
            height={250}
            width={250}
            priority
            className="w-full h-auto object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Label>
      ))}
    </div>
  );
}

function NewTab({ selectedImages }: { selectedImages: ImageType[] }) {
  return (
    <>
      {selectedImages.map((image) => (
        <div key={`selected-${image.id}`}>{image.fileName}</div>
      ))}
    </>
  );
}

function ExisitingTab({ selectedImages }: { selectedImages: ImageType[] }) {
  return <div>Existing</div>;
}
