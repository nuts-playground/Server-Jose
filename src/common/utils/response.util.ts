import { GlobalConfig } from 'src/global/config.global';
import { ResponseHeadersUtil } from './interfaces/response-headers.util.interface';

const setToken = ({ response, access_token, refresh_token }) => {
  response.cookie('access_token', access_token, {
    httpOnly: true,
    maxAge: GlobalConfig.env.jwtExpiresAccessTokenTime,
  });
  response.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    maxAge: GlobalConfig.env.jwtExpiresRefreshTokenTime,
  });
};

export const globalResponseHeadersUtil: ResponseHeadersUtil = {
  setCookiesForGuard: ({ request, response }) => {
    const access_token = request.user['access_token'];
    const refresh_token = request.user['refresh_token'];

    setToken({ response, access_token, refresh_token });
  },
  setCookies: ({ access_token, refresh_token, response }) => {
    setToken({ response, access_token, refresh_token });
  },
};
