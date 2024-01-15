import { Request, Response } from 'express';
import { prismaUtil } from './prisma.util';
import { PrismaUser } from './interfaces/prisma.util.interface';
import { JwtStrategyDto } from 'src/auth/interface/jwt.strategy.interface';
import { responseUtil } from './response.util';
import { configUtil } from './config.util';
import { jwtUtil } from './jwt.util';

export const socialLoginUtil = async (request: Request, response: Response) => {
  let name = request.user['name'].slice(0, 20);
  let isAlreadyEmail = await prismaUtil().findByEmail(request.user['email']);

  const isAreadyName = await prismaUtil().findByName(name);

  if (isAreadyName) {
    // add loop
    name = `${name}${Math.floor(Math.random() * 100000) + 1}`;
  }

  const userInfo: PrismaUser = {
    email: request.user['email'],
    nick_name: name.slice(0, 20),
    provider: request.user['provider'],
    profile_image_url: request.user['picture'],
  };

  if (isAlreadyEmail && isAlreadyEmail.provider !== userInfo.provider) {
    // add redirect url
    response.redirect(`${configUtil().getClient()}`);

    response.end();

    return;
  }

  if (!isAlreadyEmail) {
    isAlreadyEmail = await prismaUtil().saveUser(userInfo);
  }

  const payload: JwtStrategyDto = {
    sub: isAlreadyEmail.id.toString(),
    email: isAlreadyEmail.email,
  };

  const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

  responseUtil().setCookies({ response, access_token, refresh_token });

  response.redirect(`${configUtil().getClient()}`);

  response.end();
};
