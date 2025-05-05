import { z } from "zod";

export const createItemAttributeSchema = z.object({
  typeAttributeId: z.string().uuid().min(1, "Required"),
  itemId: z.string().uuid().min(1, "Required"),
  textValue: z.string().optional(),
  numericValue: z.number().optional(),
});

export const itemAttributeSchema = createItemAttributeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const simpleItemAttributeSchema = createItemAttributeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
});

export type CreateItemAttributeType = z.infer<typeof createItemAttributeSchema>;
export type ItemAttributeType = z.infer<typeof itemAttributeSchema>;
export type SimpleItemAttributeType = z.infer<typeof simpleItemAttributeSchema>;
