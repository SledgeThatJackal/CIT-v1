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
  return <TypeContext value={types}>{children}</TypeContext>;
}

export const useTypes = () => useContext(TypeContext);
