import { UserRole } from "@/drizzle/schema";

export function canCreateImage({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateImage({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteImage({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
