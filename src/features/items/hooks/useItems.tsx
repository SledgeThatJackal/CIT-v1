"use client";

import { createContext, ReactNode, useContext } from "react";
import { SimpleItemType } from "../schema/item";

const ItemContext = createContext<SimpleItemType[]>([]);

export function ItemProvider({
  items,
  children,
}: {
  items: SimpleItemType[];
  children: ReactNode;
}) {
  return <ItemContext value={items}>{children}</ItemContext>;
}

export const useItems = () => useContext(ItemContext);
