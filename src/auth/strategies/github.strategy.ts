import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigGlobal } from 'src/global/config.global';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: ConfigGlobal.env.githubId,
      clientSecret: ConfigGlobal.env.githubSecret,
      callbackURL: ConfigGlobal.env.githubCallbackUrl,
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
      const { emails, displayName, photos, provider } = profile;
      const user = {
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
