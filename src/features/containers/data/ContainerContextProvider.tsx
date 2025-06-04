import { ImageProvider } from "@/features/images/hooks/useImages";
import { ImageType } from "@/features/images/schema/images";
import CombinedContextProvider from "@/util/CombineContext";
import { ReactNode } from "react";
import { ContainerProvider } from "../hooks/useContainers";
import { ParentContainerProvider } from "../hooks/useParentContainers";
import { SimpleContainerType } from "../schema/containers";

export function ContainerContextProvider({
  images,
  containers,
  children,
}: {
  images: ImageType[];
  containers: SimpleContainerType[];
  children: ReactNode;
}) {
  return (
    <CombinedContextProvider
      providers={[
        { provider: ImageProvider, props: { images } },
        { provider: ContainerProvider, props: { containers } },
        { provider: ParentContainerProvider, props: { containers } },
      ]}
    >
      {children}
    </CombinedContextProvider>
  );
}
