import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { SocialLoginService } from './social-login.service';
import { globalResponseHeadersUtil } from 'src/common/utils/response.util';
import { globalJwtUtil } from 'src/common/utils/jwt.util';
import {
  AuthSergviceSignOut,
  AuthServiceGetProfile,
  AuthServiceRefreshToken,
  AuthServiceSignIn,
  AuthServiceSocialLogin,
} from '../interface/auth.service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly socialLoginService: SocialLoginService,
  ) {}

  async signIn({ request, response }: AuthServiceSignIn) {
    globalResponseHeadersUtil.setCookiesForGuard({ request, response });

    response.redirect('/');
    response.end();
  }

  async signOut({ response }: AuthSergviceSignOut) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.redirect('/');
    response.end();
  }

  async getProfile({ id }: AuthServiceGetProfile): Promise<any> {
    const {
      email,
      nick_name,
      about_me,
      profile_image_url,
      created_at,
      updated_at,
    } = await this.userRepository.findById({ id });

    return {
      email,
      nick_name,
      about_me,
      profile_image_url,
      created_at,
      updated_at,
    };
  }

  async refreshToken({ response, refreshToken }: AuthServiceRefreshToken) {
    try {
      const { sub, email } = await globalJwtUtil.verifyRefreshToken(
        refreshToken,
      );
      const { access_token, refresh_token } = await globalJwtUtil.getTokens({
        sub,
        email,
      });

      globalResponseHeadersUtil.setCookies({
        response,
        access_token,
        refresh_token,
      });

      response.end();
    } catch (err) {
      throw new UnauthorizedException('The token is not valid');
    }
  }

  async socialLogin({ request, response }: AuthServiceSocialLogin) {
    await this.socialLoginService.commonSocialLogin(request, response);
  }
}
