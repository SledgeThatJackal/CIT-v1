"use client";

import { createContext, ReactNode, useContext } from "react";
import { SimpleContainerType } from "../schema/containers";

const ContainerContext = createContext<SimpleContainerType[]>([]);

export function ContainerProvider({
  containers,
  children,
}: {
  containers: SimpleContainerType[];
  children: ReactNode;
}) {
  return (
    <ContainerContext.Provider value={containers}>
      {children}
    </ContainerContext.Provider>
  );
}

export const useContainers = () => useContext(ContainerContext);
