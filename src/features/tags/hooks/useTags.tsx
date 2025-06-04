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
  return <TagContext value={tags}>{children}</TagContext>;
}

export const useTags = () => useContext(TagContext);
