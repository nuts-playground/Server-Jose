import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserServiceUtil } from './utils/user.service.util';
import { RedisService } from 'src/redis/redis.service';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { sendEmail } from 'src/common/utils/email.util';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckPasswordDto } from './dtos/check-password.dto';
import { CheckNameDto } from './dtos/check-name.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { uuid_v4_generate } from 'src/common/utils/uuid.util';
import { bcrypt_hash } from 'src/common/utils/bcrypt.util';

@Injectable()
export class UserService {
  constructor(
    private readonly serviceUtil: UserServiceUtil,
    private readonly redis: RedisService,
  ) {}

  async isAlreadyEmail(dto: CheckEmailDto): Promise<ResponseDto> {
    const isAlreadyUser = await this.serviceUtil.findByEmail(dto.getEmail());

    if (isAlreadyUser) {
      throw new UnauthorizedException('가입할 수 없는 이메일입니다.');
    }

    return ResponseDto.success();
  }

  async checkName(dto: CheckNameDto): Promise<ResponseDto> {
    const isAlreadyUser = await this.serviceUtil.findByName(dto.getName());

    if (isAlreadyUser) {
      throw new UnauthorizedException('가입할 수 없는 이름입니다.');
    }

    return ResponseDto.success();
  }

  checkPassword(dto: CheckPasswordDto): ResponseDto {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,18}$/;

    if (!passwordRegex.test(dto.getPassword())) {
      throw new BadRequestException('패스워드 형식이 올바르지 않습니다.');
    }

    return ResponseDto.success();
  }

  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const email = dto.getEmail();

    await this.redis.setExpire(email, code, 60 * 5);
    await sendEmail(email, '[APP] 인증번호 안내', code);

    return ResponseDto.success();
  }

  async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const email = dto.getEmail();
    const verificationCode = await this.redis.getExpire(email);

    if (dto.getVerificationCode() !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    const password = await bcrypt_hash(dto.getPassword());
    const id = uuid_v4_generate();
    const name = dto.getName();

    await this.redis.delExpire(email);
    await this.serviceUtil.saveUser({
      id,
      email,
      name,
      password,
    });

    return ResponseDto.success();
  }
}
