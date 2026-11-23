import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient, type Prisma } from "../../generated/prisma/client";

const adapter = new PrismaLibSql(
  {
    url: process.env.DATABASE_URL!,
    authToken: process.env.AUTH_TOKEN!,
  },
);

const prisma = new PrismaClient({ adapter }); 
export default prisma;
export { Prisma };