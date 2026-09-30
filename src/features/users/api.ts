import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { z, flattenError } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUserById, updateUser } from "./services";
import { updateUserSchema, userTokenSchema, type UpdateUser } from "./validation";

const users = new Hono();

const validateUpdate = zValidator("json", updateUserSchema, (result) => {
    if (!result.success) {
        throw new HTTPException(400, {
            message: "Validation failed",
            cause: flattenError(result.error),
        });
    }
});

function getAuthenticatedUserId(payload: unknown) {
    const result = userTokenSchema.safeParse(payload);
    if (!result.success) {
        throw new HTTPException(401, { message: "Invalid authentication token" });
    }
    return result.data.id;
}

users.use("/*", jwt({
    secret: process.env.JWT_SECRET as string,
    alg: "HS256",
}));

users.get("/me", async (c) => {
    const id = getAuthenticatedUserId(c.get("jwtPayload"));
    const user = await getUserById(id);
    return c.json(user);
});

users.patch("/me", validateUpdate, async (c) => {
    const id = getAuthenticatedUserId(c.get("jwtPayload"));
    const body: UpdateUser = c.req.valid("json");
    const user = await updateUser(id, body);
    return c.json(user);
});

export default users;