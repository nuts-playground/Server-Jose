import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const configUtil = () => {
  return {
    get: <T>(configName: string): T => {
      return configService.get<T>(configName);
    },
    getPort: (): string => {
      return configService.get<string>('PORT');
    },
    getJwtSecretKey: (type: string): string => {
      return {
        access: configService.get<string>('JWT_ACCESS_SECRET'),
        refresh: configService.get<string>('JWT_REFRESH_SECRET'),
      }[type];
    },
    getJwtExpiresIn: <T>(type: string): T => {
      return {
        'access-time': configService.get<T>('ACCESS_TOKEN_EXPIRES_NUMBER_IN'),
        'access-day': configService.get<T>('ACCESS_TOKEN_EXPIRES_IN'),
        'refresh-time': configService.get<T>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
        'refresh-day': configService.get<T>('REFRESH_TOKEN_EXPIRES_IN'),
      }[type];
    },
    getRedis: <T>(type: string): T => {
      return {
        host: configService.get<T>('REDIS_HOST'),
        port: configService.get<T>('REDIS_PORT'),
      }[type];
    },
    getEmail: <T>(type: string): T => {
      return {
        service: configService.get<T>('EMAIL_SERVICE'),
        user: configService.get<T>('EMAIL_AUTH_USER'),
        pass: configService.get<T>('EMAIL_AUTH_PASSWORD'),
      }[type];
    },
  };
};
