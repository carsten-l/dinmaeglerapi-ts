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
  id: z.string().min(1),
});

export const homeListQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().nonnegative().optional(),
    price_gte: z.coerce.number().int().optional(),
    price_lte: z.coerce.number().int().optional(),
    type_eq: z.enum(["Ejerlejlighed", "Villa", "Landejendom", "Byhus"]).optional(),
  })
  .refine(
    ({ price_gte, price_lte }) =>
      (price_gte === undefined) === (price_lte === undefined),
    {
      message: "Both price_gte and price_lte are required together.",
      path: ["price_lte"],
    },
  )
  .refine(
    ({ price_gte, price_lte }) =>
      price_gte === undefined || price_lte === undefined || price_gte <= price_lte,
    {
      message: "price_gte must be less than or equal to price_lte.",
      path: ["price_gte"],
    },
  );

export type NewHome = z.infer<typeof createHomeSchema>;
export type HomeUpdate = z.infer<typeof updateHomeSchema>;
export type HomeListQuery = z.infer<typeof homeListQuerySchema>;