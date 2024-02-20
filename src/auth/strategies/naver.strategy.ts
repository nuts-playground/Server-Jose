import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { configUtil } from 'src/common/utils/config.util';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: configUtil().getNaver<string>('id'),
      clientSecret: configUtil().getNaver<string>('secret'),
      callbackURL: configUtil().getNaver<string>('callback_url'),
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
