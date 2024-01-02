import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { bcrypt_compare } from 'src/common/utils/bcrypt.util';
import { UserServiceUtil } from 'src/user/utils/user.service.util';
import { SignInDto } from './dtos/sign-in.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { RedisService } from 'src/redis/redis.service';
import { AccessToken } from './interface/auth.guard.interface';

@Injectable()
export class AuthService {
  constructor(
    private userServiceUtil: UserServiceUtil,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async signIn(dto: SignInDto): Promise<AccessToken> {
    const email = dto.getEmail();
    const password = dto.getPassword();
    const user = await this.userServiceUtil.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('입력 정보가 올바르지 않습니다.');
    }

    const decodePassword = await bcrypt_compare(password, user.password);

    if (!decodePassword) {
      throw new UnauthorizedException('입력 정보가 올바르지 않습니다.');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.redisService.setExpire(
      user.id,
      refresh_token,
      Number(process.env.REFRESH_TOKEN_EXPIRES_NUMBER_IN),
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async getProfile(dto) {
    console.log(dto);

    return ResponseDto.success();
  }
}
