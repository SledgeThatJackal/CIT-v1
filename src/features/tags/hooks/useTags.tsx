"use client";

import { createContext, ReactNode, useContext } from "react";
import { SimpleTagType } from "../schema/tag";

const TagContext = createContext<SimpleTagType[]>([]);

export function TagProvider({
  tags,
  children,
}: {
  tags: SimpleTagType[];
  children: ReactNode;
}) {
  return <TagContext.Provider value={tags}>{children}</TagContext.Provider>;
}

export const useTags = () => useContext(TagContext);
