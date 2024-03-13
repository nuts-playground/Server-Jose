import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccessToken } from '../interface/local.strategy.interface';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { AuthRedisService } from '../providers/auth-redis.service';
import { SetRefreshToken } from '../interface/auth-redis.interface';
import { GlobalConfig } from 'src/global/config.global';
import { globalJwtUtil } from 'src/common/utils/jwt.util';

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
    const { access_token, refresh_token } = await globalJwtUtil.getTokens({
      sub: id.toString(),
      email,
    });
    const jwtExpire = GlobalConfig.env.jwtExpiresRefreshTokenTime;
    const redisInfo: SetRefreshToken = {
      key: id.toString(),
      value: refresh_token,
      time: jwtExpire,
    };

    await this.authRedisService.setRefreshToken(redisInfo);

    return { access_token, refresh_token };
  }
}
