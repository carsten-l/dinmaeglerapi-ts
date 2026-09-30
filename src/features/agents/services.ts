import { HTTPException } from "hono/http-exception";
import prisma from "../../core/db";
import type { NewAgent } from "./validation";

export function getAllAgents(limit?: number, offset?: number) {
  return prisma.agent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getAgentById(id: string) {
  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) {
    throw new HTTPException(404, { message: "Agent not found" });
  }
  return agent;
}

export async function createAgent(data: NewAgent) {
  const image = await prisma.image.findUnique({ where: { id: data.imageId } });
  if (!image) {
    throw new HTTPException(404, { message: "Image not found" });
  }

  return prisma.agent.create({ data });
}