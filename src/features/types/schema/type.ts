import { z } from "zod";
import {
  createTypeAttributeSchema,
  typeAttributeSchema,
} from "./type-attribute";

export const createTypeSchema = z.object({
  name: z.string().min(1, "Required"),
});

export const typeSchema = createTypeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const formTypeSchema = createTypeSchema.extend({
  typeAttributes: z.array(
    createTypeAttributeSchema.extend({ id: z.string().optional() })
  ),
});

export const detailedTypeSchema = typeSchema.extend({
  typeAttributes: z.array(typeAttributeSchema),
});

export const simpleTypeSchema = createTypeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  typeAttributes: z.array(
    createTypeAttributeSchema.extend({
      id: z.string().uuid().min(1, "Required"),
    })
  ),
});

export type CreateTypeType = z.infer<typeof createTypeSchema>;
export type TypeType = z.infer<typeof typeSchema>;
export type FormTypeType = z.infer<typeof formTypeSchema>;
export type DetailedTypeSchema = z.infer<typeof detailedTypeSchema>;
export type SimpleTypeSchema = z.infer<typeof simpleTypeSchema>;
