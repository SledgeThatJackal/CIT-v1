import { UserRole } from "@/drizzle/schema";

export function canCreateTag({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateTag({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteTag({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
