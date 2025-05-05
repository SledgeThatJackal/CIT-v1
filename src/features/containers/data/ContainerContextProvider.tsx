import { ImageProvider } from "@/features/images/hooks/useImages";
import { ImageType } from "@/features/images/schema/images";
import CombinedContextProvider from "@/util/CombineContext";
import { ReactNode } from "react";
import { SimpleContainerType } from "../schema/containers";
import { ContainerProvider } from "../hooks/useContainers";

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
      ]}
    >
      {children}
    </CombinedContextProvider>
  );
}
