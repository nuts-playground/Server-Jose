import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccessToken } from '../interface/local.strategy.interface';
import { jwtUtil } from 'src/common/utils/jwt.util';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { AuthRedisService } from '../providers/auth-redis.service';
import { SetRefreshToken } from '../interface/auth-redis.interface';
import { ConfigGlobal } from 'src/config.global';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly authRedisService: AuthRedisService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<AccessToken> {
    const { id } = await this.userRepository.findByEmail(email);
    const payload = { email, sub: id.toString() };
    const { access_token, refresh_token } = await jwtUtil().getTokens(payload);
    const jwtExpire = ConfigGlobal.env.jwtExpiresRefreshTokenTime;
    const redisInfo: SetRefreshToken = {
      key: id.toString(),
      value: refresh_token,
      time: jwtExpire,
    };

    await this.authRedisService.setRefreshToken(redisInfo);

    return { access_token, refresh_token };
  }
}
