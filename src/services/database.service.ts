/**
 * Database Service
 * Manages Prisma client connection and initialization
 */

import { PrismaClient } from "@/prisma/client";

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({} as any);
  }
  return prisma;
};

export const disconnectPrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};
