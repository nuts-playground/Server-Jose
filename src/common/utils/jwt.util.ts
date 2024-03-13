import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { GlobalConfig } from 'src/global/config.global';
import { GlobalJwtUtil } from './interfaces/jwt.util.interface';

const jwtService = new JwtService();

export const globalJwtUtil: GlobalJwtUtil = {
  getAccessToken: async ({ sub, email }) => {
    return await jwtService.signAsync(
      { sub, email },
      {
        expiresIn: GlobalConfig.env.jwtExpiresAccessTokenDay,
        secret: GlobalConfig.env.jwtSecretKeyAccessToken,
      },
    );
  },
  getRefreshToken: async ({ sub, email }) => {
    return await jwtService.signAsync(
      { sub, email },
      {
        expiresIn: GlobalConfig.env.jwtExpiresRefreshTokenDay,
        secret: GlobalConfig.env.jwtSecretKeyRefreshToken,
      },
    );
  },
  getTokens: async ({ sub, email }) => {
    const access_token = await globalJwtUtil.getAccessToken({ sub, email });
    const refresh_token = await globalJwtUtil.getRefreshToken({ sub, email });

    return { access_token, refresh_token };
  },
  verifyAccessToken: async (token: string) => {
    try {
      return await jwtService.verifyAsync(token, {
        secret: GlobalConfig.env.jwtSecretKeyAccessToken,
      });
    } catch (error) {
      throw new UnauthorizedException('The token is not valid');
    }
  },
  verifyRefreshToken: async (token: string) => {
    try {
      return await jwtService.verifyAsync(token, {
        secret: GlobalConfig.env.jwtSecretKeyRefreshToken,
      });
    } catch (error) {
      throw new UnauthorizedException('The token is not valid');
    }
  },
};
