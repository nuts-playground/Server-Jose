export interface CommonPrismaUtil {
  onModuleInit(): Promise<void>;
  onModuleDestroy(): Promise<void>;
}
