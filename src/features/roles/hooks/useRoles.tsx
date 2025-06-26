"use client";

import { createContext, ReactNode, useContext } from "react";
import { Roles, RoleType } from "../schema/role";

const RoleContext = createContext<RoleType>(Roles["user"]);

export function RoleProvider({
  role,
  children,
}: {
  role: RoleType;
  children: ReactNode;
}) {
  return <RoleContext value={role}>{children}</RoleContext>;
}

export const useRole = () => useContext(RoleContext);
