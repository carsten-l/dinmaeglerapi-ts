import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, type Prisma } from "../../generated/prisma/client";

const adapter = new PrismaBetterSqlite3(
  { url: process.env.DATABASE_URL as string },
  { timestampFormat: "unixepoch-ms" },
);

const prisma = new PrismaClient({ adapter }); 
export default prisma;
export { Prisma };