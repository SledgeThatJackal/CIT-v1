import { z } from "zod";
import { createTypeAttributeSchema } from "./type-attribute";

export const createTypeSchema = z.object({
  name: z.string().min(1, "Required"),
});

export const typeSchema = createTypeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const formTypeSchema = createTypeSchema.extend({
  typeAttributes: z.array(createTypeAttributeSchema),
});

export type CreateTypeType = z.infer<typeof createTypeSchema>;
export type TypeType = z.infer<typeof typeSchema>;
export type FormTypeType = z.infer<typeof formTypeSchema>;
