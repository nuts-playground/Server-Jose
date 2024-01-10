import { Request, Response } from 'express';

export interface SetCookiesForGuard {
  request: Request;
  response: Response;
}

export interface SetCookies {
  response: Response;
  access_token: string;
  refresh_token: string;
}
