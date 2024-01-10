import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const configUtil = () => {
  return {
    get: <T>(configName: string) => {
      return configService.get<T>(configName);
    },
  };
};
