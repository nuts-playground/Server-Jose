export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtTokens {
  access_token: string;
  refresh_token: string;
}
