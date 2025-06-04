import { UserRole } from "@/drizzle/schema";

export function canCreateItem({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateItem({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateItemImage({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteItem({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
