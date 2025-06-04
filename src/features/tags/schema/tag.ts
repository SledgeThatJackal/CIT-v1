import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  color: z.string().min(7).max(7),
});

export const tagSchema = createTagSchema.extend({
  id: z.string().uuid().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const simpleTagSchema = createTagSchema.extend({
  id: z.string().uuid().min(1, "Required"),
});

export type TagType = z.infer<typeof tagSchema>;
export type CreateTagType = z.infer<typeof createTagSchema>;
export type SimpleTagType = z.infer<typeof simpleTagSchema>;
