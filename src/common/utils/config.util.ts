import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const configUtil = () => {
  return {
    get: <T>(configName: string): T => {
      return configService.get<T>(configName);
    },
    getClient: (): string => {
      return configService.get<string>('CLIENT_URL');
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
    getGoogle: <T>(type: string): T => {
      return {
        id: configService.get<T>('GOOGLE_CLIENT_ID'),
        secret: configService.get<T>('GOOGLE_CLIENT_SECRET'),
        callback_url: configService.get<T>('GOOGLE_CALLBACK_URL'),
      }[type];
    },
    getGithub: <T>(type: string): T => {
      return {
        id: configService.get<T>('GITHUB_CLIENT_ID'),
        secret: configService.get<T>('GITHUB_CLIENT_SECRET'),
        callback_url: configService.get<T>('GITHUB_CALLBACK_URL'),
      }[type];
    },
    getKakao: <T>(type: string): T => {
      return {
        id: configService.get<T>('KAKAO_CLIENT_ID'),
        secret: configService.get<T>('KAKAO_CLIENT_SECRET'),
        callback_url: configService.get<T>('KAKAO_CALLBACK_URL'),
      }[type];
    },
    getNaver: <T>(type: string): T => {
      return {
        id: configService.get<T>('NAVER_CLIENT_ID'),
        secret: configService.get<T>('NAVER_CLIENT_SECRET'),
        callback_url: configService.get<T>('NAVER_CALLBACK_URL'),
      }[type];
    },
  };
};
