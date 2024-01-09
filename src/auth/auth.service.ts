import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { getTokens, verifyToken } from 'src/common/utils/jwt.util';
import { findById } from 'src/common/utils/prisma.util';
import { AccessToken } from './interface/local.strategy.interface';

@Injectable()
export class AuthService {
  async getProfile(id: string) {
    const { email, name, about_me, profile_image_url, created_at, updated_at } =
      await findById(id);
    return { email, name, about_me, profile_image_url, created_at, updated_at };
  }

  async refreshToken(refreshToken: string): Promise<AccessToken> {
    try {
      const payload = await verifyToken(refreshToken);

      const { access_token, refresh_token } = await getTokens(payload);

      return { access_token, refresh_token };
    } catch (err) {
      throw new UnauthorizedException('The token is not valid');
    }
  }
}
