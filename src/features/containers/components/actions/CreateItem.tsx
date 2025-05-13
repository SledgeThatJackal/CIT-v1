"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageType } from "@/features/images/schema/images";
import { Row } from "@tanstack/react-table";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { ContainerType } from "../../schema/containers";

import ItemForm from "@/features/items/components/ItemForm";
import "@/features/items/style/item.css";
import { deleteContainerImagesFromIds } from "../../actions/containers";
import { cn } from "@/lib/utils";
import { showPromiseToast } from "@/util/Toasts";
import { addItemImages } from "@/features/items/actions/item";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tabValues = ["select", "new", "existing"] as const;
type TabType = (typeof tabValues)[number];

export default function CreateItem({
  row,
}: {
  row: Row<
    ContainerType & {
      containerItems: {
        id: string;
        itemId: string;
        quantity: number;
        item: {
          name: string;
        };
      }[];
    }
  >;
}) {
  const images = row.original.containerImages.map(
    (containerImage) => containerImage.image
  );

  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [value, setValue] = useState<TabType>(
    images.length < 1 ? "new" : "select"
  );

  return (
    <Tabs value={value}>
      <TabsList>
        <TabsTrigger
          value="select"
          className="hover:cursor-pointer"
          onClick={() => setValue("select")}
          disabled={images.length < 1}
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
          disabled={
            selectedImages.length < 1 || row.original.containerItems.length < 1
          }
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
        <NewTab
          selectedImages={selectedImages}
          name={`${row.original.name}-Item${
            row.original.containerItems.length + 1
          }`}
          containerId={row.original.id}
          onCompletion={() => setValue("select")}
        />
      </TabsContent>
      <TabsContent value="existing">
        <ExisitingTab
          selectedImages={selectedImages}
          containerItems={row.original.containerItems}
          containerId={row.original.id}
          onCompletion={() => setValue("select")}
        />
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
          className="relative w-auto rounded-lg hover:cursor-pointer"
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

function NewTab({
  selectedImages,
  name,
  containerId,
  onCompletion,
}: {
  selectedImages: ImageType[];
  name: string;
  containerId: string;
  onCompletion: () => void;
}) {
  return (
    <ItemForm
      item={{
        id: "",
        name,
        description: "",
        externalURL: "",
        tags: [],
        itemAttributes: [],
        itemImages: selectedImages.map((image, index) => ({
          id: "",
          image,
          imageOrder: index + 1,
        })),
        containerItems: [{ id: "", quantity: 1, containerId }],
      }}
      isDuplication
      onSuccess={() => {
        deleteContainerImagesFromIds(
          containerId,
          selectedImages.map((image) => image.id)
        );
        onCompletion();
      }}
    />
  );
}

function ExisitingTab({
  selectedImages,
  containerItems,
  containerId,
  onCompletion,
}: {
  selectedImages: ImageType[];
  containerItems: {
    id: string;
    itemId: string;
    quantity: number;
    item: {
      name: string;
    };
  }[];
  containerId: string;
  onCompletion: () => void;
}) {
  const [itemId, setItemId] = useState<string | undefined>();

  function handleSubmit() {
    const action = addItemImages;

    showPromiseToast(
      () =>
        action(
          itemId!,
          selectedImages.map((image) => image.id),
          containerId
        ),
      "Attempting to update item",
      onCompletion
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {containerItems.map((containerItem) => (
          <Label
            key={containerItem.id}
            className={cn(
              "itemOption p-3 rounded-lg hover:cursor-pointer",
              itemId === containerItem.itemId && "selected"
            )}
            onClick={() => setItemId(containerItem.itemId)}
          >
            {containerItem.item.name}
          </Label>
        ))}
      </div>
      <Button
        variant="outline"
        disabled={!itemId}
        className="hover:cursor-pointer"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}
