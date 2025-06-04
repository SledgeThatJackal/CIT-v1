"use client";

import PopoverAction from "@/components/PopoverAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageSelector from "@/components/ui/custom/image-selector";
import { SortableImageList } from "@/components/ui/custom/sortable-image-list";
import TrashButton from "@/components/ui/custom/trash-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showPromiseToast } from "@/util/Toasts";
import { ReactNode, useEffect, useState } from "react";
import { useImageDialogContext } from "./ImageDialog";

export default function ImageTabs() {
  const [activeTab, setActiveTab] = useState("add");
  const { images } = useImageDialogContext();

  useEffect(() => {
    if (images.length < 1) setActiveTab("add");
  }, [images.length]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="add" className="hover:cursor-pointer">
          Add
        </TabsTrigger>
        <TabsTrigger
          value="reorder"
          className="hover:cursor-pointer"
          disabled={images.length < 1}
        >
          Reorder
        </TabsTrigger>
        <TabsTrigger
          value="remove"
          className="hover:cursor-pointer"
          disabled={images.length < 1}
        >
          Remove
        </TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <AddTab />
      </TabsContent>
      <TabsContent value="reorder">
        <ReorderTab />
      </TabsContent>
      <TabsContent value="remove">
        <RemoveTab />
      </TabsContent>
    </Tabs>
  );
}

function TabCard({
  title,
  children,
  enableFooter = false,
  ...props
}: {
  title: string;
  children: ReactNode;
  enableFooter?: boolean;
  handleSave?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {enableFooter && <TabFooter {...props} />}
    </Card>
  );
}

function TabFooter({ handleSave }: { handleSave?: () => void }) {
  const { handleCancel } = useImageDialogContext();

  if (!handleSave) throw new Error("Cancel or Save function not provided");

  return (
    <CardFooter className="flex justify-between">
      <Button
        variant="destructiveOutline"
        className="hover:cursor-pointer"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        variant="outline"
        className="hover:cursor-pointer"
      >
        Save
      </Button>
    </CardFooter>
  );
}

function AddTab() {
  const [newImages, setNewImages] = useState<string[]>([]);

  const { addImages, id, images } = useImageDialogContext();

  if (!addImages) return <div>No function to delete image provided</div>;

  function filterFunc(
    options: {
      id: string;
      fileName: string;
    }[]
  ) {
    return options.filter(
      (option) => !images.some((i) => i.image.id === option.id)
    );
  }

  function handleSave() {
    const action = addImages!.bind(null, id);

    const promise = () => action(newImages);

    showPromiseToast(promise, "Attempting to create image(s)");

    setNewImages([]);
  }

  return (
    <TabCard title={"Add Images"} handleSave={handleSave} enableFooter>
      <ImageSelector
        selectedImages={newImages}
        onSelectedImageChange={setNewImages}
        filterFunc={filterFunc}
      />
    </TabCard>
  );
}

function ReorderTab() {
  const { images: selectedImages, reorderImages } = useImageDialogContext();
  const [images, setImages] = useState(selectedImages);

  if (!reorderImages) return <div>No function to reorder images provided</div>;

  function handleOrderChange(newOrder: string[]) {
    const imagesMap = Object.fromEntries(
      images.map((image) => [image.image.id, image])
    );

    setImages(
      newOrder.map((id) => imagesMap[id]).filter((image) => image !== undefined)
    );
  }

  function handleSave() {
    const promise = () =>
      reorderImages!(
        images.map((image) => image.id).filter((image) => image !== undefined)
      );

    showPromiseToast(promise, "Attempting to reorder images");
  }

  return (
    <TabCard title="Reorder Images" handleSave={handleSave} enableFooter>
      <div className="border rounded-sm p-1 bg-background">
        <SortableImageList
          images={images.map((image) => image.image)}
          handleOrderChange={handleOrderChange}
        />
      </div>
    </TabCard>
  );
}

function RemoveTab() {
  const { images, deleteImage } = useImageDialogContext();

  if (!deleteImage) return <div>No function to delete image provided</div>;

  return (
    <TabCard title="Remove Images">
      <ul className="space-y-1">
        {images.map((image) => (
          <li
            key={`remove-${image.id}`}
            className="p-1 flex align-middle border rounded-sm bg-background"
          >
            <p className="flex items-center ml-2.5">{image.image.fileName}</p>
            <PopoverAction
              action={deleteImage.bind(null, image.id)}
              loading={`Attempting to delete image: ${image.image.fileName}`}
            >
              <TrashButton className="my-auto" />
            </PopoverAction>
          </li>
        ))}
      </ul>
    </TabCard>
  );
}
