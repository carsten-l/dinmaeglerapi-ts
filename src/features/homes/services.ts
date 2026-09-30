import { HTTPException } from "hono/http-exception";
import prisma from "../../core/db";
import type { HomeListQuery, HomeUpdate, NewHome } from "./validation";

export function getAllHomes({ limit, offset, price_gte, price_lte, type_eq }: HomeListQuery) {
  return prisma.home.findMany({
    where: {
      ...(price_gte !== undefined && price_lte !== undefined
        ? { price: { gte: price_gte, lte: price_lte } }
        : {}),
      ...(type_eq !== undefined ? { type: type_eq } : {}),
    },
    take: limit,
    skip: offset,
  });
}

export function getHomesCount() {
  return prisma.home.count();
}

export async function getHomeById(id: string) {
  const home = await prisma.home.findUnique({ where: { id } });
  if (!home) {
    throw new HTTPException(404, { message: "Home not found" });
  }
  return home;
}

export function createHome(data: NewHome) {
  return prisma.home.create({ data });
}

export async function updateHome(id: string, data: HomeUpdate) {
  const existingHome = await prisma.home.findUnique({ where: { id } });
  if (!existingHome) {
    throw new HTTPException(404, { message: "Home not found" });
  }
  return prisma.home.update({ where: { id }, data });
}

export async function deleteHome(id: string) {
  const existingHome = await prisma.home.findUnique({ where: { id } });
  if (!existingHome) {
    throw new HTTPException(404, { message: "Home not found" });
  }
  await prisma.home.delete({ where: { id } });
}