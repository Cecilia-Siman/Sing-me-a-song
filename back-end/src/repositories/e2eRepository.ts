import { prisma } from "../database.js";

export async function deleteAll() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}