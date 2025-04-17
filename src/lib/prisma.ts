//import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../../prisma/src/generated/prisma";

const globalForprisma = global as unknown as { prisma: PrismaClient };

function makeClient(){
    return new PrismaClient({ log: ["error", "info", "warn"] })
}

export const prisma = globalForprisma.prisma || makeClient();
if(process.env.NODE_ENV === "production"){
    globalForprisma.prisma = prisma;
}