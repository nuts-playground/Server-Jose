import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const getConfig = <T>(configName: string) => {
  return configService.get<T>(configName);
};
