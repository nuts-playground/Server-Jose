import { Request, Response } from 'express';
import { prismaUtil } from './prisma.util';
import { PrismaUser } from './interfaces/prisma.util.interface';
import { JwtStrategyDto } from 'src/auth/interface/jwt.strategy.interface';
import { responseUtil } from './response.util';
import { configUtil } from './config.util';
import { jwtUtil } from './jwt.util';

export const socialLoginUtil = async (request: Request, response: Response) => {
  const provider = request.user['provider'];
  const sliceName = request.user['name'].slice(0, 14);
  const userEmail = request.user['email'];
  const profileImageUrl = request.user['picture'];
  let isAlreadyEmail = await prismaUtil().findByEmail(userEmail);

  if (isAlreadyEmail && isAlreadyEmail.provider !== provider) {
    // 다른 소셜 로그인으로 가입한 이메일이 이미 존재할 경우 리다이렉트 url 추가해야함
    response.redirect(`${configUtil().getClient()}`);

    response.end();

    return;
  }

  if (!isAlreadyEmail) {
    const isAreadyName = await createRandomName(sliceName);

    const userInfo: PrismaUser = {
      email: userEmail,
      nick_name: isAreadyName,
      provider: provider,
      profile_image_url: profileImageUrl,
    };

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

const createRandomName = async (name: string): Promise<string> => {
  const isAlreadyName = await prismaUtil().findByName(name);

  if (!isAlreadyName) {
    return name;
  }

  const randomName = `${name}${Math.floor(Math.random() * 100000) + 1}`;

  return createRandomName(randomName);
};
