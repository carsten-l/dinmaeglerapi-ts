import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  description: z.string().min(1),
  imageId: z.string().min(1),
}).strict();

export const agentSlugSchema = z.object({
  slug: z.string().min(1),
});

export const agentListQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export type NewAgent = z.infer<typeof createAgentSchema>;