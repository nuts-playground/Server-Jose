import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccessToken } from '../interface/local.strategy.interface';
import { jwtUtil } from 'src/common/utils/jwt.util';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<AccessToken> {
    const { id } = await this.userRepository.findByEmail(email);
    const payload = { email, sub: id.toString() };
    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);

    return { access_token, refresh_token };
  }
}
