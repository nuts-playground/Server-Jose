import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserServiceUtil } from './utils/user.service.util';
import { uuid_v4_generate } from 'src/common/utils/uuid.util';
import { bcrypt_hash } from 'src/common/utils/bcrypt.util';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService extends UserServiceUtil {
  constructor(
    prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super(prisma);
  }

  async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const isAlreadyUser = await this.findOne(dto.getEmail());

    if (isAlreadyUser) {
      throw new UnauthorizedException('이미 가입된 메일입니다.');
    }

    const hashedPassword = await bcrypt_hash(dto.getPassword());
    await this.saveUser({
      id: uuid_v4_generate(),
      password: hashedPassword,
      ...dto.getSignUpInfo(),
    });

    return ResponseDto.successWithJSON(dto.responseUserInfo());
  }

  // Need Create Controller
  async sendVerificationEmail(email: string): Promise<any> {
    const redis = this.redisService.getRedisClient();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(email, code, 'EX', 60 * 5);

    return;
  }

  // Need Create Controller
  async verifyEmail(email: string, verificationsCode: string): Promise<any> {
    const redis = this.redisService.getRedisClient();
    const storedCode = await redis.get(email);

    if (storedCode !== verificationsCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await redis.del(email);
    }

    return;
  }

  async signIn(dto: SignInDto): Promise<any> {
    console.log(dto.getEmail);
    console.log(dto.getPassword);
    return;
  }

  async patch(): Promise<any> {
    return;
  }
}
