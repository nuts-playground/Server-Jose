import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { ConfigGlobal } from 'src/global/config.global';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: ConfigGlobal.env.naverId,
      clientSecret: ConfigGlobal.env.naverSecret,
      callbackURL: ConfigGlobal.env.naverCallbackUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const userInfo = profile._json.response;
      const provider = profile.provider;
      const user = {
        email: userInfo.email,
        name: userInfo.nickname,
        picture: userInfo.profile_image,
        provider,
        accessToken,
        refreshToken,
      };

      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
