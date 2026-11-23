import { z } from "zod";

export const favoriteHomeIdSchema = z.object({
  id: z.uuid(),
});

export const favoritesUserPayloadSchema = z.object({
  id: z.number().int().positive(),
});