import { UserRole } from "@/drizzle/schema";

export function canUpdateSettings({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
