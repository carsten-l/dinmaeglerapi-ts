// src/services/messages.service.ts
import prisma, { Prisma } from "../../core/db";
import type { NewMessage } from "../messages/validation"; 


  export async function createMessage (data: NewMessage) {

    const olderThan12Hours = Date.now() - 12 * 60 * 60 * 1000;

    await prisma.message.deleteMany({
      where: { createdAt: { lt: new Date(olderThan12Hours) } }
    });
    
    return await prisma.message.create({ data });
  }

  export async function getAllMessages () {
    return await prisma.message.findMany();
  }


