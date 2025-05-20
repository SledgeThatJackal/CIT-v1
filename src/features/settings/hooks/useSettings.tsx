"use client";

import { createContext, ReactNode, useContext } from "react";
import { SettingsType } from "../schema/settings";

const SettingsContext = createContext<SettingsType[]>([]);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SettingsType[];
  children: ReactNode;
}) {
  return <SettingsContext value={settings}>{children}</SettingsContext>;
}

export const useSettings = () => useContext<SettingsType[]>(SettingsContext);
