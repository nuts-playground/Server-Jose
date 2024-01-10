import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getTokens, verifyRefreshToken } from 'src/common/utils/jwt.util';
import { findById } from 'src/common/utils/prisma.util';
import { Request, Response } from 'express';
import {
  setCookies,
  setCookiesForGuard,
} from 'src/common/utils/set-response.util';

@Injectable()
export class AuthService {
  async signIn(request: Request, response: Response) {
    setCookiesForGuard(request, response);

    response.redirect('/');
    response.end();
  }

  async getProfile(id: string) {
    const { email, name, about_me, profile_image_url, created_at, updated_at } =
      await findById(id);
    return { email, name, about_me, profile_image_url, created_at, updated_at };
  }

  async refreshToken(response: Response, refreshToken: string) {
    try {
      const { sub, email } = await verifyRefreshToken(refreshToken);
      const { access_token, refresh_token } = await getTokens({ sub, email });

      setCookies(response, access_token, refresh_token);

      response.end();
    } catch (err) {
      throw new UnauthorizedException('The token is not valid');
    }
  }
}
