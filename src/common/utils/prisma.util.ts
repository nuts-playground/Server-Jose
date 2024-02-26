import { PrismaClient } from '@prisma/client';
import { CommonPrismaUtil } from './interfaces/prisma.util.interface';

export const prisma = new PrismaClient();

export const commonPrismaUtil = (): CommonPrismaUtil => {
  return {
    onModuleInit: async () => {
      await prisma.$connect();
    },
    onModuleDestroy: async () => {
      await prisma.$disconnect();
    },
  };
};
