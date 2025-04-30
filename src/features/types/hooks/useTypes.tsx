"use client";

import { createContext, ReactNode, useContext } from "react";
import { SimpleTypeSchema } from "../schema/type";

const TypeContext = createContext<SimpleTypeSchema[]>([]);

export function TypeProvider({
  types,
  children,
}: {
  types: SimpleTypeSchema[];
  children: ReactNode;
}) {
  return <TypeContext.Provider value={types}>{children}</TypeContext.Provider>;
}

export const useTypes = () => useContext(TypeContext);
