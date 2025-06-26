import { UserRole } from "@/drizzle/schema";
import { z } from "zod";

export const roleSchema = z.object({
  canCreate: z.boolean(),
  canRead: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});

export type RoleType = z.infer<typeof roleSchema>;

export const Roles: { [K in UserRole]: RoleType } = {
  user: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
  },
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
  },
} as const;
