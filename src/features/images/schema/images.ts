import { z } from "zod";

export const imageSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  fileName: z.string().min(1, "Required"),
});

export const imageJoinSchema = z.object({
  id: z.string().uuid().min(1, "Required"),
  image: imageSchema,
  imageOrder: z.number(),
});

export type ImageType = z.infer<typeof imageSchema>;
export type ImageJoinType = z.infer<typeof imageJoinSchema>;
