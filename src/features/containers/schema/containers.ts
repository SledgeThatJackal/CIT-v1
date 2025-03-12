import { z } from "zod";

const image = z.object({
  id: z.string().uuid().min(1, "Required"),
  fileName: z.string().min(1, "Required"),
});

const containerImageSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  image,
  imageOrder: z.number(),
});

export const parentContainerSchema = z.object({
  id: z.string().uuid().min(1, "Required").nullable(),
  name: z.string().min(1, "Required"),
  barcodeId: z.string().min(1, "Required"),
  isArea: z.boolean(),
});

export const containerSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  barcodeId: z.string().min(1, "Required"),
  parent: parentContainerSchema.nullable(),
  isArea: z.boolean(),
  containerImages: z.array(containerImageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createContainerSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  barcodeId: z.string().min(1, "Required"),
  parentId: z.string().uuid().optional(),
  isArea: z.boolean(),
});

export type ContainerType = z.infer<typeof containerSchema>;
export type ParentContainerType = z.infer<typeof parentContainerSchema>;
export type CreateContainerType = z.infer<typeof createContainerSchema>;
