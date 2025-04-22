"use client";

import { createContext, ReactNode, useContext } from "react";
import { ImageType } from "../schema/images";

const ImageContext = createContext<ImageType[]>([]);

export function ImageProvider({
  images,
  children,
}: {
  images: ImageType[];
  children: ReactNode;
}) {
  return (
    <ImageContext.Provider value={images}>{children}</ImageContext.Provider>
  );
}

export const useImages = () => useContext(ImageContext);
