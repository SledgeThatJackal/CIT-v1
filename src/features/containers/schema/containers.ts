import { imageJoinSchema } from "@/features/images/schema/images";
import { z } from "zod";

export const parentContainerSchema = z.object({
  id: z.string().uuid().min(1, "Required").nullable(),
  name: z.string().min(1, "Required"),
  barcodeId: z.string().min(1, "Required"),
  isArea: z.boolean(),
});

const containerItem = z.object({
  id: z.string().uuid().min(1, "Required"),
  itemId: z.string().uuid().min(1, "Required"),
  quantity: z.number().positive(),
  item: z.object({
    name: z.string().min(1, "Required"),
  }),
});

export const containerSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  barcodeId: z.string().min(1, "Required"),
  parent: parentContainerSchema.nullable(),
  isArea: z.boolean(),
  containerImages: z.array(imageJoinSchema),
  containerItems: z.array(containerItem),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createContainerSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  barcodeId: z.string().min(1, "Required"),
  parentId: z.string().uuid().optional(),
  isArea: z.boolean(),
  containerImages: z.array(z.string()).optional(),
});

export const simpleContainerSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().min(1, "Required"),
  barcodeId: z.string().min(1, "Required"),
});

export type ContainerType = z.infer<typeof containerSchema>;
export type ParentContainerType = z.infer<typeof parentContainerSchema>;
export type CreateContainerType = z.infer<typeof createContainerSchema>;
export type SimpleContainerType = z.infer<typeof simpleContainerSchema>;
