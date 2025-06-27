import { userRoles } from "@/drizzle/schema";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(userRoles),
  email: z.string().email().min(1),
  clerkUserId: z.string().min(1),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type UserType = z.infer<typeof userSchema>;
