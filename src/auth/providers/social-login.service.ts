import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { AuthRedisService } from './auth-redis.service';
import { GlobalConfig } from 'src/global/config.global';
import { globalJwtUtil } from 'src/common/utils/jwt.util';
import { globalResponseHeadersUtil } from 'src/common/utils/response.util';

@Injectable()
export class SocialLoginService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly authRedisService: AuthRedisService,
  ) {}

  async commonSocialLogin(request: Request, response: Response) {
    const provider = request.user['provider'];
    const sliceName = request.user['name'].slice(0, 14);
    const userEmail = request.user['email'];
    const profileImageUrl = request.user['picture'];
    let isAlreadyEmail = await this.userRepository.findByEmail(userEmail);

    if (isAlreadyEmail && isAlreadyEmail.provider !== provider) {
      // 다른 소셜 로그인으로 가입한 이메일이 이미 존재할 경우 리다이렉트 url 추가해야함
      response.redirect(`${GlobalConfig.env.clientUrl}`);
      response.end();

      return;
    }

    if (!isAlreadyEmail) {
      const isAreadyName = await this.createRandomName(sliceName);
      const userInfo = {
        email: userEmail,
        nick_name: isAreadyName,
        provider: provider,
        profile_image_url: profileImageUrl,
      };

      isAlreadyEmail = await this.userRepository.saveUser(userInfo);
    }
    const { access_token, refresh_token } = await globalJwtUtil.getTokens({
      sub: isAlreadyEmail.id.toString(),
      email: isAlreadyEmail.email,
    });
    const redisExpireTime = GlobalConfig.env.jwtExpiresRefreshTokenTime;
    const redisInfo = {
      key: isAlreadyEmail.id.toString(),
      value: refresh_token,
      time: redisExpireTime,
    };

    await this.authRedisService.setRefreshToken(redisInfo);

    globalResponseHeadersUtil.setCookies({
      response,
      access_token,
      refresh_token,
    });
    response.redirect(GlobalConfig.env.clientUrl);
    response.end();
  }

  private async createRandomName(name: string): Promise<string> {
    const isAlreadyName = await this.userRepository.findByName({
      nick_name: name,
    });

    if (!isAlreadyName) {
      return name;
    }

    const randomName = `${name}${Math.floor(Math.random() * 100000) + 1}`;

    return this.createRandomName(randomName);
  }
}
