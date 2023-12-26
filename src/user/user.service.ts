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
import { time_now } from 'src/common/utils/date.util';
import { uuid_v4_generate } from 'src/common/utils/uuid.util';

@Injectable()
export class UserService {
  constructor(
    private readonly serviceUtil: UserServiceUtil,
    private readonly redis: RedisService,
  ) {}

  // TODO: sha256 hash
  async getSignUpToken(): Promise<ResponseDto> {
    const token = Buffer.from(
      `${uuid_v4_generate()}${Math.floor(
        100000000 + Math.random() * 900000000,
      ).toString()}${Math.floor(
        100000000 + Math.random() * 900000000,
      ).toString()}`,
      'utf-8',
    ).toString('base64');
    console.log(token);

    return;
  }

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
    const passwordRegex = /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,18}/;

    if (!passwordRegex.test(dto.getPassword())) {
      throw new BadRequestException('패스워드 형식이 올바르지 않습니다.');
    }

    return ResponseDto.success();
  }

  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.setExpire(dto.getEmail(), code, 60 * 5);
    await sendEmail(dto.getEmail(), '[APP] 인증번호 안내', code);

    return ResponseDto.success();
  }

  // ======================================================
  // async signUp(dto: SignUpDto): Promise<ResponseDto> {
  //   const email = dto.getEmail();
  //   const isAlreadyUser = await this.serviceUtil.findByEmail(email);

  //   if (isAlreadyUser) {
  //     throw new UnauthorizedException('이미 가입된 메일입니다.');
  //   }
  //   const password = dto.getPassword();
  //   const hashedPassword = await bcrypt_hash(password);

  //   await this.serviceUtil.saveUser({
  //     id: uuid_v4_generate(),
  //     password: hashedPassword,
  //     ...dto.getSignUpInfo(),
  //   });

  //   const response = dto.responseUserInfo();

  //   return ResponseDto.successWithJSON(response);
  // }

  // async sendVerificationCode(
  //   dto: SendVerificationCodeDto,
  // ): Promise<ResponseDto> {
  //   const email = dto.getEmail();
  //   const code = Math.floor(100000 + Math.random() * 900000).toString();

  //   await this.redis.setExpire(email, code, 60 * 5);

  //   await sendEmail(dto.getEmail(), '[APP] 인증번호 안내', code);

  //   return ResponseDto.success('인증번호가 발송되었습니다.');
  // }

  // async checkVerificationCode(
  //   dto: CheckVerificationCodeDto,
  // ): Promise<ResponseDto> {
  //   const email = dto.getEmail();
  //   const verificationCode = dto.getVerificationCode();

  //   const storedCode = await this.redis.getExpire(email);

  //   if (storedCode !== verificationCode) {
  //     throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
  //   } else {
  //     await this.redis.delExpire(email);
  //   }

  //   return ResponseDto.success('이메일 인증이 완료되었습니다.');
  // }

  // async patchUser(): Promise<ResponseDto> {
  //   return ResponseDto.success('patchUser');
  // }
}
