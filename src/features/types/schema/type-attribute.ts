import { typeAttributeDataTypes } from "@/drizzle/schema";
import { z } from "zod";

export const createTypeAttributeSchema = z.object({
  displayOrder: z.number().positive(),
  dataType: z.enum(typeAttributeDataTypes),
  textDefaultValue: z.string().optional(),
  numericDefaultValue: z.number().optional(),
  title: z.string().min(1, "Required"),
});

export const typeAttributeSchema = createTypeAttributeSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  itemTypeId: z.string().uuid().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTypeAttributeType = z.infer<typeof createTypeAttributeSchema>;
export type TypeAttributeType = z.infer<typeof typeAttributeSchema>;
