import prisma from "../../core/db.ts";



export async function getAllSubscribers() {
  return await prisma.subscriber.findMany();
}

export async function createSubscriber(email: string) {

    const olderThan12Hours = Date.now() - 12 * 60 * 60 * 1000;

    await prisma.subscriber.deleteMany({
      where: { createdAt: { lt: new Date(olderThan12Hours) } }
    });

    return await prisma.subscriber.create({ data: { email } });
}


export async function deleteSubscriber(email: string) {
  return await prisma.subscriber.delete({ where: { email } });
}
