import prisma from "../../core/db";
import { hashSync } from "bcryptjs";
import { HTTPException } from "hono/http-exception";
import type { UpdateUser } from "./validation";

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUser(id: number, data: UpdateUser) {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      password: data.newPassword ? hashSync(data.newPassword, 15) : undefined,
    },
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
