import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configUtil } from 'src/common/utils/config.util';
import { Strategy } from 'passport-github2';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: configUtil().getGithub<string>('id'),
      clientSecret: configUtil().getGithub<string>('secret'),
      callbackURL: configUtil().getGithub<string>('callback_url'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, emails, username, displayName, photos, provider } = profile;
    const user = {
      id,
      email: emails[0].value,
      username,
      name: displayName,
      picture: photos[0].value,
      provider,
      accessToken,
      refreshToken,
    };

    return user;
  }
}
