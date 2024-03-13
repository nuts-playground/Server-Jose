import { Request, Response } from 'express';

export interface ResponseHeadersUtil {
  readonly setCookiesForGuard: ({
    request,
    response,
  }: {
    request: Request;
    response: Response;
  }) => void;
  readonly setCookies: ({
    access_token,
    refresh_token,
    response,
  }: {
    access_token: string;
    refresh_token: string;
    response: any;
  }) => void;
}
