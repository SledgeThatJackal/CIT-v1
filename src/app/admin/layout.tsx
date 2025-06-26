import ActiveLink from "@/components/ActiveLink";
import Navbar from "@/components/ui/custom/navbar";
import { RoleProvider } from "@/features/roles/hooks/useRoles";
import { Roles } from "@/features/roles/schema/role";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar>
        <ActiveLink href="/admin">Home</ActiveLink>
        <ActiveLink href="/admin/container">Containers</ActiveLink>
        <ActiveLink href="/admin/item">Items</ActiveLink>
        <ActiveLink href="/admin/tag">Tags</ActiveLink>
        <ActiveLink href="/admin/type">Types</ActiveLink>
        <ActiveLink href="/admin/find">Find</ActiveLink>
        <ActiveLink href="/admin/reports">Reports</ActiveLink>
        <ActiveLink href="/admin/settings">Settings</ActiveLink>
      </Navbar>
      <RoleProvider role={Roles["admin"]}>{children}</RoleProvider>
    </>
  );
}
