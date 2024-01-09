import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { findByEmail } from 'src/common/utils/prisma.util';
import { AccessToken } from '../interface/local.strategy.interface';
import { getConfig } from 'src/common/config/global-config.util';
import { redisSetExpire } from 'src/common/utils/redis.util';
import { getTokens } from 'src/common/utils/jwt.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<AccessToken> {
    const { id } = await findByEmail(email);
    const payload = { email, sub: id };

    const { access_token, refresh_token } = await getTokens(payload);

    await redisSetExpire(
      id,
      refresh_token,
      getConfig<number>('REFRESH_TOKEN_EXPIRES_NUMBER_IN'),
    );

    return { access_token, refresh_token };
  }
}
