import { ContainerProvider } from "@/features/containers/data/useContainers";
import { SimpleContainerType } from "@/features/containers/schema/containers";
import { ImageProvider } from "@/features/images/hooks/useImages";
import { ImageType } from "@/features/images/schema/images";
import { TagProvider } from "@/features/tags/hooks/useTags";
import { SimpleTagType } from "@/features/tags/schema/tag";
import { TypeProvider } from "@/features/types/hooks/useTypes";
import { SimpleTypeSchema } from "@/features/types/schema/type";
import CombinedContextProvider from "@/util/CombineContext";
import { ReactNode } from "react";

export function ItemContextProvider({
  images,
  tags,
  types,
  containers,
  children,
}: {
  images: ImageType[];
  tags: SimpleTagType[];
  types: SimpleTypeSchema[];
  containers: SimpleContainerType[];
  children: ReactNode;
}) {
  return (
    <CombinedContextProvider
      providers={[
        { provider: ImageProvider, props: { images } },
        { provider: TagProvider, props: { tags } },
        { provider: TypeProvider, props: { types } },
        { provider: ContainerProvider, props: { containers } },
      ]}
    >
      {children}
    </CombinedContextProvider>
  );
}
