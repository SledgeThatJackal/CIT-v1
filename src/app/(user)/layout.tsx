import ActiveLink from "@/components/ActiveLink";
import Navbar from "@/components/ui/custom/navbar";
import { RoleProvider } from "@/features/roles/hooks/useRoles";
import { Roles } from "@/features/roles/schema/role";
import { ReactNode } from "react";

export default function UserLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar>
        <ActiveLink href="/">Home</ActiveLink>
        <ActiveLink href="/container">Containers</ActiveLink>
        <ActiveLink href="/item">Items</ActiveLink>
        <ActiveLink href="/tag">Tags</ActiveLink>
        <ActiveLink href="/type">Types</ActiveLink>
      </Navbar>
      <RoleProvider role={Roles["user"]}>{children}</RoleProvider>
    </>
  );
}
