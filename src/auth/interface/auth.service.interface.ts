import { Request, Response } from 'express';

export interface AuthServiceSignIn {
  readonly request: Request;
  readonly response: Response;
}

export interface AuthSergviceSignOut {
  readonly response: Response;
}

export interface AuthServiceGetProfile {
  readonly id: number;
}
export interface AuthServiceRefreshToken {
  readonly response: Response;
  refreshToken: string;
}

export interface AuthServiceSocialLogin {
  readonly request: Request;
  readonly response: Response;
}
