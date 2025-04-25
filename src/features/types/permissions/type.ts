import { UserRole } from "@/drizzle/schema";

export function canCreateType({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateType({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteType({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
