import { AppGlobal } from './app.global';
import { GetEnvConfig } from './interface/config.interface';

export class ConfigGlobal {
  private static readonly configService = AppGlobal.configService;

  public static env: GetEnvConfig = {
    port: this.configService.get<number>('PORT'),
    clientUrl: this.configService.get<string>('CLIENT_URL'),
    jwtSecretKeyAccessToken:
      this.configService.get<string>('JWT_ACCESS_SECRET'),
    jwtSecretKeyRefreshToken:
      this.configService.get<string>('JWT_REFRESH_SECRET'),
    jwtExpiresAccessTokenTime: this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRES_NUMBER_IN',
    ),
    jwtExpiresRefreshTokenTime: this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_NUMBER_IN',
    ),
    jwtExpiresAccessTokenDay: this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
    ),
    jwtExpiresRefreshTokenDay: this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
    ),
    redisHost: this.configService.get<string>('REDIS_HOST'),
    redisPort: this.configService.get<number>('REDIS_PORT'),
    emailService: this.configService.get<string>('EMAIL_SERVICE'),
    emailUser: this.configService.get<string>('EMAIL_AUTH_USER'),
    emailPassword: this.configService.get<string>('EMAIL_AUTH_PASSWORD'),
    googleId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    googleSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    googleCallbackUrl: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    githubId: this.configService.get<string>('GITHUB_CLIENT_ID'),
    githubSecret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
    githubCallbackUrl: this.configService.get<string>('GITHUB_CALLBACK_URL'),
    kakaoId: this.configService.get<string>('KAKAO_CLIENT_ID'),
    kakaoSecret: this.configService.get<string>('KAKAO_CLIENT_SECRET'),
    kakaoCallbackUrl: this.configService.get<string>('KAKAO_CALLBACK_URL'),
    naverId: this.configService.get<string>('NAVER_CLIENT_ID'),
    naverSecret: this.configService.get<string>('NAVER_CLIENT_SECRET'),
    naverCallbackUrl: this.configService.get<string>('NAVER_CALLBACK_URL'),
    imageServerUrl: this.configService.get<string>('IMAGE_SERVER_URL'),
  };
}
