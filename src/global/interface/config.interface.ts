export interface GetEnvConfig {
  port: number;
  clientUrl: string;
  jwtSecretKeyAccessToken: string;
  jwtSecretKeyRefreshToken: string;
  jwtExpiresAccessTokenTime: number;
  jwtExpiresRefreshTokenTime: number;
  jwtExpiresAccessTokenDay: string;
  jwtExpiresRefreshTokenDay: string;
  redisHost: string;
  redisPort: number;
  emailService: string;
  emailUser: string;
  emailPassword: string;
  googleId: string;
  googleSecret: string;
  googleCallbackUrl: string;
  githubId: string;
  githubSecret: string;
  githubCallbackUrl: string;
  kakaoId: string;
  kakaoSecret: string;
  kakaoCallbackUrl: string;
  naverId: string;
  naverSecret: string;
  naverCallbackUrl: string;
  imageServerUrl: string;
}
