"use client";

import { createContext, ReactNode, useContext } from "react";
import { SimpleContainerType } from "../schema/containers";

export type ContainerWithParentType = SimpleContainerType & { isArea: boolean };

const ParentContainerContext = createContext<ContainerWithParentType[]>([]);

export function ParentContainerProvider({
  containers,
  children,
}: {
  containers: ContainerWithParentType[];
  children: ReactNode;
}) {
  return (
    <ParentContainerContext value={containers}>
      {children}
    </ParentContainerContext>
  );
}

export const useParentContainers = () => useContext(ParentContainerContext);
