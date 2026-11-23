import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { flattenError } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  favoriteHomeIdSchema,
  favoritesUserPayloadSchema,
} from "./validation";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "./services";

const favorites = new Hono();

const validateHomeId = zValidator("param", favoriteHomeIdSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid home ID",
      cause: flattenError(result.error),
    });
  }
});

function getAuthenticatedUserId(payload: unknown) {
  const result = favoritesUserPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new HTTPException(401, { message: "Invalid authentication token" });
  }
  return result.data.id;
}

favorites.use("/*", jwt({
  secret: process.env.JWT_SECRET as string,
  alg: "HS256",
}));

favorites.get("/", async (c) => {
  const result = await getUserFavorites(getAuthenticatedUserId(c.get("jwtPayload")));
  return c.json({ data: result });
});

favorites.post("/add/:id", validateHomeId, async (c) => {
  const { id } = c.req.valid("param");
  const result = await addFavorite(getAuthenticatedUserId(c.get("jwtPayload")), id);
  return c.json({ data: result });
});

favorites.delete("/remove/:id", validateHomeId, async (c) => {
  const { id } = c.req.valid("param");
  const result = await removeFavorite(getAuthenticatedUserId(c.get("jwtPayload")), id);
  return c.json({ data: result });
});

export default favorites;