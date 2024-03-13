export interface GlobalJwtUtil {
  readonly getAccessToken: ({
    sub,
    email,
  }: {
    sub: string;
    email: string;
  }) => Promise<string>;
  readonly getRefreshToken: ({
    sub,
    email,
  }: {
    sub: string;
    email: string;
  }) => Promise<string>;
  readonly verifyAccessToken: (token: string) => Promise<any>;
  readonly verifyRefreshToken: (token: string) => Promise<any>;
  readonly getTokens: ({
    sub,
    email,
  }: {
    sub: string;
    email: string;
  }) => Promise<{ access_token: string; refresh_token: string }>;
}
