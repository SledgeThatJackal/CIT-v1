import { imageJoinSchema } from "@/features/images/schema/images";
import { simpleTagSchema } from "@/features/tags/schema/tag";
import { simpleItemAttributeSchema } from "@/features/types/schema/item-attribute";
import { createTypeSchema } from "@/features/types/schema/type";
import { createTypeAttributeSchema } from "@/features/types/schema/type-attribute";
import { z } from "zod";

const containerItems = z.object({
  containerId: z.string().uuid().min(1, "Required"),
  quantity: z.number().positive(),
});

const container = z.object({
  name: z.string().min(1, "Required"),
  barcodeId: z.string().min(1, "Required"),
});

const expandedContainerItems = containerItems.extend({
  id: z.string().uuid().min(1, "Required"),
  container,
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

const typeSchema = createTypeSchema.extend({
  id: z.string().min(1, "Required"),
});

const itemAttributeSchema = simpleItemAttributeSchema
  .omit({
    itemId: true,
  })
  .extend({
    typeAttribute: createTypeAttributeSchema.omit({
      textDefaultValue: true,
      numericDefaultValue: true,
    }),
  });

export const itemSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  externalUrl: z.string().optional(),
  tags: z.array(simpleTagSchema),
  itemType: typeSchema.optional(),
  itemAttributes: z.array(itemAttributeSchema),
  itemImages: z.array(imageJoinSchema),
  containerItems: z.array(expandedContainerItems),
  createdAt: z.string().date(),
  updatedAt: z.string().date(),
});

export type CreateItemType = z.infer<typeof createItemSchema>;
export type ItemType = z.infer<typeof itemSchema>;
