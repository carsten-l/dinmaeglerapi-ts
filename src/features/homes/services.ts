import { HTTPException } from "hono/http-exception";
import prisma from "../../core/db.ts";
import type { HomeUpdate, NewHome } from "./validation.ts";

export function getAllHomes(limit?: number, offset?: number) {
  return prisma.home.findMany({
    take: limit,
    skip: offset,
    
    select: { id: true, slug: true, type: true, energylabel: true, price: true, cost: true, rooms: true, address1: true, address2: true,
        postalcode: true, city: true, createdAt: true, thumbnail: { omit: {id: true, createdAt: true}}
     },
     
  },
  );
}

export function getHomesCount() {
  return prisma.home.count();
}

export async function getHomeById(id: string) {
  const home = await prisma.home.findUnique({ where: { id }  });
  if (!home) {
    throw new HTTPException(404, { message: "Home not found" });
  }
  return home;
}

export async function getHomeBySlug(slug: string) {
  const home = await prisma.home.findUnique({ 
    where: { slug },
    include: {
        images: { omit: {id: true, createdAt: true}},
        floorplan: {omit: {id: true, createdAt: true}},
        agent: {include: {image: {omit: {id: true, createdAt: true}} },omit: {id: true, createdAt: true, imageId: true}}
    }, 
    omit: {floorplanImgId: true, thumbnailImgId: true, agentId: true}
  });
  if (!home) {
    throw new HTTPException(404, { message: "Home not found" });
  }

  home.images.sort((a, b) => {
const aInternal = a.path.startsWith("/int_g");
const bInternal = b.path.startsWith("/int_g");

if (aInternal === bInternal) {
return 0;
}

return aInternal ? 1 : -1;
});


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