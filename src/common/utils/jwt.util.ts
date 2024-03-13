import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtTokens } from './interfaces/jwt.util.interface';
import { ConfigGlobal } from 'src/config.global';

const jwtService = new JwtService();

export const jwtUtil = () => {
  return {
    getAccessToken: async (payload: JwtPayload): Promise<string> => {
      const access_token = await getAccessToken(payload);

      return access_token;
    },
    getRefreshToken: async (payload: JwtPayload): Promise<string> => {
      const refresh_token = await getRefreshToken(payload);

      return refresh_token;
    },
    getTokens: async (payload: JwtPayload): Promise<JwtTokens> => {
      const access_token = await getAccessToken(payload);
      const refresh_token = await getRefreshToken(payload);

      return { access_token, refresh_token };
    },
    verifyAccessToken: async (token: string): Promise<JwtPayload> => {
      try {
        const payload = await jwtService.verifyAsync(token, {
          secret: ConfigGlobal.env.jwtSecretKeyAccessToken,
        });

        return payload;
      } catch (error) {
        throw new UnauthorizedException('The token is not valid');
      }
    },
    verifyRefreshToken: async (token: string): Promise<JwtPayload> => {
      try {
        const payload = await jwtService.verifyAsync(token, {
          secret: ConfigGlobal.env.jwtSecretKeyRefreshToken,
        });

        return payload;
      } catch (error) {
        throw new UnauthorizedException('The token is not valid');
      }
    },
  };
};

const getAccessToken = async (payload: JwtPayload): Promise<string> => {
  const access_token = await jwtService.signAsync(payload, {
    expiresIn: ConfigGlobal.env.jwtExpiresAccessTokenDay,
    secret: ConfigGlobal.env.jwtSecretKeyAccessToken,
  });

  return access_token;
};

const getRefreshToken = async (payload: JwtPayload): Promise<string> => {
  const refresh_token = await jwtService.signAsync(payload, {
    expiresIn: ConfigGlobal.env.jwtExpiresRefreshTokenDay,
    secret: ConfigGlobal.env.jwtSecretKeyRefreshToken,
  });

  return refresh_token;
};
