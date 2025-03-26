"use client";

import { showPromiseToastAndReturnValue } from "@/util/Toasts";
import React, { useRef } from "react";
import { MultiSelect } from "./multi-select";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { SortableImageList } from "./sortable-image-list";

export default function ImageSelector({
  selectedImages = [],
  options,
  onSelectedImageChange,
}: {
  selectedImages?: string[];
  options: { id: string; fileName: string }[];
  onSelectedImageChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const data = new FormData();
      const files = e.target.files;

      for (let i = 0; i < files.length; i++) {
        data.append("images", files[i]!);
      }

      const promise = (): Promise<{
        message: string;
        images: { id: string; fileName: string }[];
      }> =>
        fetch("/api/image", {
          method: "POST",
          body: data,
        }).then((res) => res.json());

      function addImagesToContainer(data: {
        message: string;
        images: { id: string; fileName: string }[];
      }) {
        const images = data.images;

        if (images.length !== 0) {
          onSelectedImageChange([
            ...new Set(selectedImages.concat(images.map((image) => image.id))),
          ]);
        }
      }

      showPromiseToastAndReturnValue<{
        message: string;
        images: { id: string; fileName: string }[];
      }>(promise, "Attempting to create image(s)", addImagesToContainer);
    }
  }

  return (
    <div className="text-sm border border-accent-alternate rounded-lg">
      <input
        type="file"
        id="image-selector"
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleChange}
        ref={inputRef}
      />
      <fieldset
        role="group"
        className={cn(
          "grid grid-cols-[7rem_1fr_11rem] divide-x-1 divide-solid rounded-lg overflow-hidden",
          selectedImages.length > 0 &&
            "border-accent-alternate rounded-none rounded-t-lg border-b-1"
        )}
      >
        <Button
          id="image-selector-button"
          variant="outline"
          className="hover:cursor-pointer p-2 rounded-none border-none"
          onClick={() => inputRef.current?.click()}
        >
          Choose File(s)
        </Button>
        <label
          htmlFor="image-selector-button"
          className="hover:cursor-pointer p-2 text-muted-foreground"
        >
          {selectedImages.length > 0
            ? `${selectedImages.length} file(s) chosen`
            : "No files chosen"}
        </label>
        <MultiSelect
          selectPlaceholder="Add existing images"
          searchPlaceholder="Search images"
          options={options}
          getLabel={(i) => i.fileName}
          getValue={(i) => i.id}
          selectedValues={selectedImages}
          onSelectedValuesChange={onSelectedImageChange}
          buttonClassName="rounded-none border-none"
        />
      </fieldset>
      {selectedImages.length > 0 && (
        <div className="p-0.5">
          <SortableImageList
            images={selectedImages.map((image) => {
              return options.find((option) => option.id === image)!;
            })}
            handleOrderChange={onSelectedImageChange}
            handleClick={(id: string) =>
              onSelectedImageChange(
                selectedImages.filter((image) => image !== id)
              )
            }
          />
        </div>
      )}
    </div>
  );
}
