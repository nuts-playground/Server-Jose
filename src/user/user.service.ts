import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserServiceUtil } from './utils/user.service.util';
import { uuid_v4_generate } from 'src/common/utils/uuid.util';
import { bcrypt_hash } from 'src/common/utils/bcrypt.util';
import { RedisService } from 'src/redis/redis.service';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { CheckVerificationCodeDto } from './dtos/check-verification-code.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly serviceUtil: UserServiceUtil,
    private readonly redis: RedisService,
  ) {}

  /**
   * COMPELTE
   */
  async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const email = dto.getEmail();
    const isAlreadyUser = await this.serviceUtil.findByEmail(email);

    if (isAlreadyUser) {
      throw new UnauthorizedException('이미 가입된 메일입니다.');
    }
    const password = dto.getPassword();
    const hashedPassword = await bcrypt_hash(password);

    await this.serviceUtil.saveUser({
      id: uuid_v4_generate(),
      password: hashedPassword,
      ...dto.getSignUpInfo(),
    });

    const response = dto.responseUserInfo();

    return ResponseDto.successWithJSON(response);
  }

  /**
   * TODO: Need to apply email service (node-mailer)
   */
  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const email = dto.getEmail();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.setExpire(email, code, 60 * 5);

    return ResponseDto.success('인증번호가 발송되었습니다.');
  }

  /**
   * COMPELTE
   */
  async checkVerificationCode(
    dto: CheckVerificationCodeDto,
  ): Promise<ResponseDto> {
    const email = dto.getEmail();
    const verificationCode = dto.getVerificationCode();
    const storedCode = await this.redis.getExpire(email);

    if (storedCode !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.redis.delExpire(email);
    }

    return ResponseDto.success('이메일 인증이 완료되었습니다.');
  }

  /**
   * TODO
   */
  async patchUser(): Promise<ResponseDto> {
    return ResponseDto.success('patchUser');
  }
}
