import { HTTPException } from "hono/http-exception";
import prisma from "../../core/db.ts";

async function ensureUserAndHomeExist(userId: number, homeId: string) {
  const [user, home] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.home.findUnique({ where: { id: homeId }, select: { id: true } }),
  ]);

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }
  if (!home) {
    throw new HTTPException(404, { message: "Home not found" });
  }
}

export async function getUserFavorites(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { favorites: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return user.favorites;
}

export async function addFavorite(userId: number, homeId: string) {
  await ensureUserAndHomeExist(userId, homeId);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { favorites: { connect: { id: homeId } } },
    select: { favorites: true },
  });

  return user.favorites;
}

export async function removeFavorite(userId: number, homeId: string) {
  await ensureUserAndHomeExist(userId, homeId);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { favorites: { disconnect: { id: homeId } } },
    select: { favorites: true },
  });

  return user.favorites;
}