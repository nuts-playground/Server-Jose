import { Request, Response } from 'express';
import { getConfig } from '../config/global-config.util';

export const setCookiesForGuard = (request: Request, response: Response) => {
  response.cookie('access_token', request.user['access_token'], {
    httpOnly: true,
    maxAge: getConfig<number>('ACCESS_TOKEN_EXPIRES_NUMBER_IN'),
  });
  response.cookie('refresh_token', request.user['refresh_token'], {
    httpOnly: true,
    maxAge: getConfig<number>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
  });
};

export const setCookies = (
  response: Response,
  access_token: string,
  refresh_token: string,
) => {
  response.cookie('access_token', access_token, {
    httpOnly: true,
    maxAge: getConfig<number>('ACCESS_TOKEN_EXPIRES_NUMBER_IN'),
  });

  response.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    maxAge: getConfig<number>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
  });
};
