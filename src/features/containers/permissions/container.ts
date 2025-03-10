import { UserRole } from "@/drizzle/schema";

export function canCreateContainer({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateContainer({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteContainer({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
