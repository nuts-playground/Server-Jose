import { JwtService } from '@nestjs/jwt';
import { configUtil } from './config.util';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtTokens } from './interfaces/jwt.util.interface';

const jwtService = new JwtService();

export const jwtUtil = () => {
  return {
    getAccessToken: async (payload: JwtPayload): Promise<string> => {
      const access_token = await jwtService.signAsync(payload, {
        expiresIn: configUtil().get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        secret: configUtil().get<string>('JWT_ACCESS_SECRET'),
      });

      return access_token;
    },
    getRefreshToken: async (payload: JwtPayload): Promise<string> => {
      const refresh_token = await jwtService.signAsync(payload, {
        expiresIn: configUtil().get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        secret: configUtil().get<string>('JWT_REFRESH_SECRET'),
      });

      return refresh_token;
    },
    getTokens: async (payload: JwtPayload): Promise<JwtTokens> => {
      const access_token = await jwtService.signAsync(payload, {
        expiresIn: configUtil().get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        secret: configUtil().get<string>('JWT_ACCESS_SECRET'),
      });
      const refresh_token = await jwtService.signAsync(payload, {
        expiresIn: configUtil().get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        secret: configUtil().get<string>('JWT_REFRESH_SECRET'),
      });

      return { access_token, refresh_token };
    },
    verifyAccessToken: async (token: string): Promise<JwtPayload> => {
      try {
        const payload = await jwtService.verifyAsync(token, {
          secret: configUtil().get<string>('JWT_ACCESS_SECRET'),
        });

        return payload;
      } catch (error) {
        throw new UnauthorizedException('The token is not valid');
      }
    },
    verifyRefreshToken: async (token: string): Promise<JwtPayload> => {
      try {
        const payload = await jwtService.verifyAsync(token, {
          secret: configUtil().get<string>('JWT_REFRESH_SECRET'),
        });

        return payload;
      } catch (error) {
        throw new UnauthorizedException('The token is not valid');
      }
    },
  };
};
