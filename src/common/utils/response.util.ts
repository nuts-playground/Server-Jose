import { configUtil } from './config.util';
import {
  SetCookies,
  SetCookiesForGuard,
} from './interfaces/response.util.interface';

export const responseUtil = () => {
  return {
    setCookiesForGuard: (setInfo: SetCookiesForGuard) => {
      const setCookiesInfo = {
        response: setInfo.response,
        access_token: setInfo.request.user['access_token'],
        refresh_token: setInfo.request.user['refresh_token'],
      };
      setCookies(setCookiesInfo);
    },
    setCookies: (setInfo: SetCookies) => {
      const setCookiesInfo = {
        response: setInfo.response,
        access_token: setInfo.access_token,
        refresh_token: setInfo.refresh_token,
      };

      setCookies(setCookiesInfo);
    },
  };
};

const setCookies = (setInfo: SetCookies) => {
  setInfo.response.cookie('access_token', setInfo.access_token, {
    httpOnly: true,
    maxAge: configUtil().getJwtExpiresIn<number>('access-time'),
  });
  setInfo.response.cookie('refresh_token', setInfo.refresh_token, {
    httpOnly: true,
    maxAge: configUtil().getJwtExpiresIn<number>('refresh-time'),
  });
};
