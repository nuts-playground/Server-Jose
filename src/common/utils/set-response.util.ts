import { configUtil } from './config.util';
import {
  SetCookies,
  SetCookiesForGuard,
} from './interfaces/response.util.interface';

export const responseUtil = () => {
  return {
    setCookiesForGuard: (setInfo: SetCookiesForGuard) => {
      setInfo.response.cookie(
        'access_token',
        setInfo.request.user['access_token'],
        {
          httpOnly: true,
          maxAge: configUtil().get<number>('ACCESS_TOKEN_EXPIRES_NUMBER_IN'),
        },
      );
      setInfo.response.cookie(
        'refresh_token',
        setInfo.request.user['refresh_token'],
        {
          httpOnly: true,
          maxAge: configUtil().get<number>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
        },
      );
    },
    setCookies: (setInfo: SetCookies) => {
      setInfo.response.cookie('access_token', setInfo.access_token, {
        httpOnly: true,
        maxAge: configUtil().get<number>('ACCESS_TOKEN_EXPIRES_NUMBER_IN'),
      });

      setInfo.response.cookie('refresh_token', setInfo.refresh_token, {
        httpOnly: true,
        maxAge: configUtil().get<number>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
      });
    },
  };
};
