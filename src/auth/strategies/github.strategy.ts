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
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { id, emails, displayName, photos, provider } = profile;
      const user = {
        id,
        email: emails[0].value,
        name: displayName ? displayName : '',
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
