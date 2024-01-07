import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const prismaOnModuleInit = async () => {
  await prisma.$connect();
};
