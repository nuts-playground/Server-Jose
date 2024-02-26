import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccessToken } from '../interface/local.strategy.interface';
import { userPrismaUtil } from 'src/user/utils/prisma.util';
import { jwtUtil } from 'src/common/utils/jwt.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<AccessToken> {
    const { id } = await userPrismaUtil().findByEmail(email);
    const payload = { email, sub: id.toString() };
    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

    return { access_token, refresh_token };
  }
}
