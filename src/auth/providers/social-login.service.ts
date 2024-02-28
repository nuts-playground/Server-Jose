import { Request, Response } from 'express';
import { JwtStrategyDto } from 'src/auth/interface/jwt.strategy.interface';
import { responseUtil } from 'src/common/utils/response.util';
import { configUtil } from 'src/common/utils/config.util';
import { jwtUtil } from 'src/common/utils/jwt.util';
import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { RepositoryUserInfo } from 'src/user/interface/repository.interface';

@Injectable()
export class SocialLoginService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  async commonSocialLogin(request: Request, response: Response) {
    const provider = request.user['provider'];
    const sliceName = request.user['name'].slice(0, 14);
    const userEmail = request.user['email'];
    const profileImageUrl = request.user['picture'];
    let isAlreadyEmail = await this.userRepository.findByEmail(userEmail);

    if (isAlreadyEmail && isAlreadyEmail.provider !== provider) {
      // 다른 소셜 로그인으로 가입한 이메일이 이미 존재할 경우 리다이렉트 url 추가해야함
      response.redirect(`${configUtil().getClient()}`);

      response.end();

      return;
    }

    if (!isAlreadyEmail) {
      const isAreadyName = await this.createRandomName(sliceName);

      const userInfo: RepositoryUserInfo = {
        email: userEmail,
        nick_name: isAreadyName,
        provider: provider,
        profile_image_url: profileImageUrl,
      };

      isAlreadyEmail = await this.userRepository.saveUser(userInfo);
    }

    const payload: JwtStrategyDto = {
      sub: isAlreadyEmail.id.toString(),
      email: isAlreadyEmail.email,
    };

    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

    responseUtil().setCookies({ response, access_token, refresh_token });

    response.redirect(`${configUtil().getClient()}`);

    response.end();
  }

  private async createRandomName(name: string): Promise<string> {
    const isAlreadyName = await this.userRepository.findByName(name);

    if (!isAlreadyName) {
      return name;
    }

    const randomName = `${name}${Math.floor(Math.random() * 100000) + 1}`;

    return this.createRandomName(randomName);
  }
}
