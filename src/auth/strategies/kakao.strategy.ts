import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { GlobalConfig } from 'src/global/config.global';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: GlobalConfig.env.kakaoId,
      clientSecret: GlobalConfig.env.kakaoSecret,
      callbackURL: GlobalConfig.env.kakaoCallbackUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { displayName, provider } = profile;
      const json = profile._json;
      const user = {
        email: json.kakao_account.email,
        name: displayName,
        picture: json.properties.profile_image,
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
