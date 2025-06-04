"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageJoinType } from "@/features/images/schema/images";
import { Table } from "@tanstack/react-table";
import { createContext, ReactNode, useContext, useState } from "react";
import ImageTabs from "./ImageTabs";

const ImageDialogContext = createContext<ImageDialogType | undefined>(
  undefined
);

export type ImageDialogType = {
  id: string;
  images: ImageJoinType[];
  addImages?: (id: string, ids: string[]) => Promise<{ message: string }>;
  reorderImages?: (ids: string[]) => Promise<{ message: string }>;
  deleteImage?: (id: string) => Promise<{ message: string }>;
  handleCancel: () => void;
};

export default function ImageDialog<T>({
  selectedImages,
  children,
  table,
  id,
}: {
  selectedImages: ImageJoinType[];
  children: ReactNode;
  table: Table<T>;
  id: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing Images</DialogTitle>
        </DialogHeader>
        <ImageDialogProvider
          value={{
            id,
            images: selectedImages,
            addImages: table.options.meta?.addImages,
            reorderImages: table.options.meta?.reorderImages,
            deleteImage: table.options.meta?.deleteImage,
            handleCancel: () => setOpen(false),
          }}
        >
          <ImageTabs />
        </ImageDialogProvider>
        <DialogDescription />
      </DialogContent>
    </Dialog>
  );
}

function ImageDialogProvider({
  value,
  children,
}: {
  value: ImageDialogType;
  children: ReactNode;
}) {
  return (
    <ImageDialogContext.Provider value={value}>
      {children}
    </ImageDialogContext.Provider>
  );
}

export function useImageDialogContext() {
  const context = useContext(ImageDialogContext);

  if (!context)
    throw new Error("ImageDialogContext must be used within a provider");

  return context;
}
