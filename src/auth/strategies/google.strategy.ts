import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { configUtil } from 'src/common/utils/config.util';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configUtil().getGoogle<string>('id'),
      clientSecret: configUtil().getGoogle<string>('secret'),
      callbackURL: configUtil().getGoogle<string>('callback_url'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { name, emails, photos, provider } = profile;
      const userName = `${name.familyName ? name.familyName : ''}${
        name.givenName ? name.givenName : ''
      }`;
      const user = {
        email: emails[0].value,
        name: userName.trim(),
        picture: photos[0].value,
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
