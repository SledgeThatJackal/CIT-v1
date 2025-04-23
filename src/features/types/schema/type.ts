import { z } from "zod";

export const createTypeSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().uuid().min(1, "Required"),
});

export const typeSchema = createTypeSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTypeType = z.infer<typeof createTypeSchema>;
export type TypeType = z.infer<typeof typeSchema>;
