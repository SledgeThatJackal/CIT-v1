import { imageJoinSchema } from "@/features/images/schema/images";
import { createTagSchema } from "@/features/tags/schema/tag";
import { z } from "zod";

const containerItems = z.object({
  containerId: z.string().uuid().min(1, "Required"),
  quantity: z.number().positive(),
});

const tags = z.array(z.string().uuid().min(1, "Required"));

const itemAttributes = z.object({
  typeAttributeId: z.string().uuid().min(1, "Required"),
  textValue: z.string().optional(),
  numericValue: z.number().optional(),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  externalUrl: z.string().optional(),
  itemTypeId: z.string().uuid().optional(),
  containerItems: z.array(containerItems).optional(),
  itemImages: z.array(z.string().uuid()).optional(),
  tags: tags.optional(),
  itemAttributes: z.array(itemAttributes).optional(),
});

export const itemSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  externalUrl: z.string().optional(),
  tags: z.array(
    createTagSchema.extend({ id: z.string().uuid().min(1, "Required") })
  ),
  itemType: z
    .object({
      id: z.string().min(1, "Required"),
      name: z.string().min(1, "Required"),
    })
    .optional(),
  itemAttributes: z.array(
    z.object({
      id: z.string().uuid().min(1, "Required"),
      typeAttributeId: z.string().uuid().min(1, "Required"),
      textValue: z.string().optional(),
      numericValue: z.number().optional(),
    })
  ),
  itemImages: z.array(imageJoinSchema),
  containerItems: z.array(
    containerItems.extend({
      id: z.string().uuid().min(1, "Required"),
    })
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateItemType = z.infer<typeof createItemSchema>;
export type ItemType = z.infer<typeof itemSchema>;
