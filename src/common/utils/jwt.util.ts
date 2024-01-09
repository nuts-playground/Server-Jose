import { JwtService } from '@nestjs/jwt';
import { getConfig } from '../config/global-config.util';
import { JwtStrategyDto } from 'src/auth/interface/jwt.strategy.interface';
import { AccessToken } from 'src/auth/interface/local.strategy.interface';
import { UnauthorizedException } from '@nestjs/common';
import { JwtUtilPayloadInterface } from './interfaces/jwt/jwt-util.interface';

const jwtService = new JwtService();

export const getTokens = async (
  payload: JwtStrategyDto,
): Promise<AccessToken> => {
  const access_token = await jwtService.signAsync(payload, {
    expiresIn: getConfig<string>('ACCESS_TOKEN_EXPIRES_IN'),
    secret: getConfig<string>('JWT_ACCESS_SECRET'),
  });

  const refresh_token = await jwtService.signAsync(payload, {
    expiresIn: getConfig<string>('REFRESH_TOKEN_EXPIRES_IN'),
    secret: getConfig<string>('JWT_REFRESH_SECRET'),
  });

  return { access_token, refresh_token };
};

export const verifyToken = async (
  token: string,
): Promise<JwtUtilPayloadInterface> => {
  try {
    const payload = await jwtService.verifyAsync(token);
    return payload;
  } catch (error) {
    throw new UnauthorizedException('The token is not valid');
  }
};
