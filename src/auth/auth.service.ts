import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { bcrypt_compare } from 'src/common/utils/bcrypt.util';
import { AccessToken } from './interface/auth.guard.interface';
import { redisSetExpire } from 'src/common/utils/redis.util';
import { findByEmail } from 'src/user/utils/user.service.util';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(email: string, password: string): Promise<AccessToken> | null {
    const user = await findByEmail(email);

    if (user) {
      const isPassword = await bcrypt_compare(password, user.password);

      if (isPassword) {
        const payload = { email: user.email, sub: user.id };
        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });

        await redisSetExpire(
          user.id,
          refresh_token,
          Number(process.env.REFRESH_TOKEN_EXPIRES_NUMBER_IN),
        );

        return {
          access_token,
          refresh_token,
          email,
        };
      }
    }

    return null;
  }
}
