import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { configUtil } from 'src/common/utils/config.util';
import { PrismaUser } from 'src/common/utils/interfaces/prisma.util.interface';
import { jwtUtil } from 'src/common/utils/jwt.util';
import { prismaUtil } from 'src/common/utils/prisma.util';
import { responseUtil } from 'src/common/utils/response.util';
import { JwtStrategyDto } from './interface/jwt.strategy.interface';

@Injectable()
export class AuthService {
  async signIn(request: Request, response: Response) {
    responseUtil().setCookiesForGuard({ request, response });

    response.redirect('/');
    response.end();
  }

  async getProfile(id: number): Promise<any> {
    const {
      email,
      nick_name,
      about_me,
      profile_image_url,
      created_at,
      updated_at,
    } = await prismaUtil().findById(id);

    return {
      email,
      nick_name,
      about_me,
      profile_image_url,
      created_at,
      updated_at,
    };
  }

  async refreshToken(response: Response, refreshToken: string) {
    try {
      const { sub, email } = await jwtUtil().verifyRefreshToken(refreshToken);
      const { access_token, refresh_token } = await jwtUtil().getTokens({
        sub,
        email,
      });

      responseUtil().setCookies({ response, access_token, refresh_token });
      response.end();
    } catch (err) {
      throw new UnauthorizedException('The token is not valid');
    }
  }

  async setToken(payload: JwtStrategyDto, response: Response) {
    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

    responseUtil().setCookies({ response, access_token, refresh_token });

    response.end();
  }

  async googleLogin(request: Request, response: Response) {
    console.log(request.user);
  }

  async githubLogin(request: Request, response: Response) {
    let isAlreadyUser = await prismaUtil().findByEmail(request.user['email']);

    const userInfo: PrismaUser = {
      email: request.user['email'],
      nick_name: request.user['name'].slice(0, 20),
      provider: request.user['provider'],
      profile_image_url: request.user['picture'],
    };

    if (!isAlreadyUser) {
      isAlreadyUser = await prismaUtil().saveUser(userInfo);
    }

    const payload = {
      sub: isAlreadyUser.id.toString(),
      email: isAlreadyUser.email,
    };

    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

    responseUtil().setCookies({ response, access_token, refresh_token });

    response.redirect(`${configUtil().getClient()}`);
    response.end();
  }
}
