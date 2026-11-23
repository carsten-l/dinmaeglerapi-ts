import { HTTPException } from "hono/http-exception";
import prisma from "../../core/db";
import type { NewAgent } from "./validation";

export function getAllAgents(limit?: number, offset?: number) {
  return prisma.agent.findMany({
    orderBy: { createdAt: "asc" },
    take: limit,
    skip: offset,
  });
}

export async function getAgentBySlug(slug: string) {
  const agent = await prisma.agent.findUnique({ 
    where: { slug },
    include: { image: true },
    omit: { imageId: true }
 });
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