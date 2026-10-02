import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { z, flattenError } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  createHomeSchema,
  homeIdSchema,
  homeSlugSchema,
  homeListQuerySchema,
  updateHomeSchema,
  type NewHome,
  type HomeUpdate,
} from "./validation";
import {
  createHome,
  deleteHome,
  getAllHomes,
  getHomeById,
  getHomeBySlug,
  getHomesCount,
  updateHome,
} from "./services";

const homes = new Hono();

const validateCreateHome = zValidator("json", createHomeSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }
});

const validateUpdateHome = zValidator("json", updateHomeSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }
});

const validateHomeId = zValidator("param", homeIdSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid home ID",
      cause: flattenError(result.error),
    });
  }
});

const validateHomeSlug = zValidator("param", homeSlugSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid home ID",
      cause: flattenError(result.error),
    });
  }
});

const validateHomeListQuery = zValidator("query", homeListQuerySchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid home query parameters",
      cause: flattenError(result.error),
    });
  }
});

homes.get("/", validateHomeListQuery, async (c) => {
  const query = c.req.valid("query");
  const results = await getAllHomes(query.limit, query.offset);
  return c.json({ data: results, meta: { count: results.length } });
});

homes.get("/count", async (c) => {
  const count = await getHomesCount();
  return c.json({ data: { count } });
});

homes.get("/id/:id", validateHomeId, async (c) => {
  const { id } = c.req.valid("param");
  const home = await getHomeById(id);
  return c.json({ data: home });
});

homes.get("/:slug", validateHomeSlug, async (c) => {
  const { slug } = c.req.valid("param");
  const home = await getHomeBySlug(slug);
  return c.json({ data: home });
});

homes.use("/*", jwt({
  secret: process.env.JWT_SECRET as string,
  alg: "HS256",
}));

homes.post("/", validateCreateHome, async (c) => {
  const body: NewHome = c.req.valid("json");
  const home = await createHome(body);
  return c.json({ data: home }, 201);
});

homes.patch("/:id", validateHomeId, validateUpdateHome, async (c) => {
  const { id } = c.req.valid("param");
  const body: HomeUpdate = c.req.valid("json");
  const home = await updateHome(id, body);
  return c.json({ data: home });
});

homes.delete("/:id", validateHomeId, async (c) => {
  const { id } = c.req.valid("param");
  await deleteHome(id);
  return c.body(null, 204);
});

export default homes;