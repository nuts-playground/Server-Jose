import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { configUtil } from 'src/common/utils/config.util';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
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
  ): Promise<any> {
    const { id, name, emails, photos, provider } = profile;
    const user = {
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      provider,
      accessToken,
      refreshToken,
    };
    return user;
  }
}
