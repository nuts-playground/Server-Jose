export interface JwtStrategyPayloadInterface {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

export interface JwtStrategyValueInterface {
  id: number;
  email: string;
}

export interface JwtStrategyDto {
  sub: string;
  email: string;
}
