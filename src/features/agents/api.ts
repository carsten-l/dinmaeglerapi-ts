import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { flattenError } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  agentSlugSchema,
  agentListQuerySchema,
  createAgentSchema,
  type NewAgent,
} from "./validation";
import { createAgent, getAgentBySlug, getAllAgents } from "./services";

const agents = new Hono();

const validateAgentSlug = zValidator("param", agentSlugSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid agent slug",
      cause: flattenError(result.error),
    });
  }
});

const validateAgentListQuery = zValidator("query", agentListQuerySchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Invalid pagination parameters",
      cause: flattenError(result.error),
    });
  }
});

const validateCreateAgent = zValidator("json", createAgentSchema, (result) => {
  if (!result.success) {
    throw new HTTPException(400, {
      message: "Validation failed",
      cause: flattenError(result.error),
    });
  }
});

agents.get("/", validateAgentListQuery, async (c) => {
  const { limit, offset } = c.req.valid("query");
  const results = await getAllAgents(limit, offset);
  return c.json({ data: results, meta: { count: results.length } });
});

agents.get("/:slug", validateAgentSlug, async (c) => {
  const { slug } = c.req.valid("param");
  const agent = await getAgentBySlug(slug);
  return c.json({ data: agent });
});

agents.use("/*", jwt({
  secret: process.env.JWT_SECRET as string,
  alg: "HS256",
}));

agents.post("/", validateCreateAgent, async (c) => {
  const body: NewAgent = c.req.valid("json");
  const agent = await createAgent(body);
  return c.json({ data: agent }, 201);
});

export default agents;