import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigGlobal } from 'src/global/config.global';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: ConfigGlobal.env.kakaoId,
      clientSecret: ConfigGlobal.env.kakaoSecret,
      callbackURL: ConfigGlobal.env.kakaoCallbackUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      console.log(profile);
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
