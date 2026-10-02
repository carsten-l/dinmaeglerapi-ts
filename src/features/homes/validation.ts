import { z } from "zod";

const homeFields = {
  slug: z.string().min(1),
  energylabel: z.string().min(1),
  type: z.string().min(1),
  price: z.number().int(),
  gross: z.number().int(),
  netto: z.number().int(),
  payment: z.number().int(),
  cost: z.number().int(),
  rooms: z.string().min(1),
  livingspace: z.number().int(),
  basementsize: z.number().int(),
  lotsize: z.number().int(),
  address1: z.string().min(1),
  address2: z.string(),
  postalcode: z.number().int(),
  city: z.string().min(1),
  description: z.string().min(1),
  built: z.number().int(),
  remodel: z.number().int(),
  lat: z.number(),
  long: z.number(),
  floorplanImgId: z.string().min(1),
  agentId: z.string().min(1),
};

export const createHomeSchema = z.object(homeFields).strict();

export const updateHomeSchema = z
  .object(homeFields)
  .partial()
  .strict()
  .refine((home) => Object.keys(home).length > 0, {
    message: "At least one field is required.",
  });

export const homeIdSchema = z.object({
  id: z.uuid(),
});

export const homeSlugSchema = z.object({
  slug: z.string().min(1),
});

export const homeListQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().nonnegative().optional()
 });

export type NewHome = z.infer<typeof createHomeSchema>;
export type HomeUpdate = z.infer<typeof updateHomeSchema>;
export type HomeListQuery = z.infer<typeof homeListQuerySchema>;