import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { configUtil } from 'src/common/utils/config.util';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: configUtil().getKakao<string>('id'),
      clientSecret: configUtil().getKakao<string>('secret'),
      callbackURL: configUtil().getKakao<string>('callback_url'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { id, displayName, provider } = profile;
      const json = profile._json;
      const user = {
        id,
        email: json.kakao_account.email,
        name: displayName,
        picture: json.properties.profile_image,
        provider,
        accessToken,
        refreshToken,
      };
      console.log(done);

      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
