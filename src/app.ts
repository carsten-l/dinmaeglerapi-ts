import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { HTTPException } from 'hono/http-exception'
import auth from "./features/auth/api.ts";
import users from "./features/users/api.ts";
import subscribers from './features/subscribers/api.ts';
import images from "./features/images/api.ts";
import homes from "./features/homes/api.ts";
import agents from "./features/agents/api.ts";
import favorites from "./features/favorites/api.ts";
import messages from "./features/messages/api.ts";

const app = new Hono();
app.use("*", cors());
app.use("*", logger());
app.use("/*", serveStatic({ root: "./public" }));


app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const cause = (error as any).cause
    console.error(`HTTPException: ${error.message}`, cause);
    return c.json(
      {
        message: error.message,
        ...(cause && { errors: cause }), // already frontend-friendly
      },
      error.status
    )
  }

  return c.json({ message: 'Internal Server Error' }, 500)
})


app.route("/auth", auth);
app.route("/users", users);
app.route("/subscribers", subscribers);
app.route("/images", images);
app.route("/homes", homes);
app.route("/agents", agents);
app.route("/favorites", favorites);
app.route("/messages", messages);




export default app;
