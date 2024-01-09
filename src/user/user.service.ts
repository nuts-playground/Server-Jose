import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckPasswordDto } from './dtos/check-password.dto';
import { CheckNameDto } from './dtos/check-name.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { uuid_v4_generate } from 'src/common/utils/uuid.util';
import { bcrypt_hash } from 'src/common/utils/bcrypt.util';
import { redisDelExpire, redisGetExpire } from 'src/common/utils/redis.util';
import { verificationCodeToEmail } from 'src/common/utils/verification-code.util';
import { PasswordStrength } from 'src/common/unions/password-strength.union';
import {
  findByEmail,
  findByName,
  saveUser,
} from 'src/common/utils/prisma.util';

@Injectable()
export class UserService {
  async isAlreadyEmail(dto: CheckEmailDto): Promise<ResponseDto> {
    const isAlreadyUser = await findByEmail(dto.getEmail());

    if (isAlreadyUser) {
      throw new UnauthorizedException('가입할 수 없는 이메일입니다.');
    }

    return ResponseDto.success();
  }

  async checkName(dto: CheckNameDto): Promise<ResponseDto> {
    const isAlreadyUser = await findByName(dto.getName());

    if (isAlreadyUser) {
      throw new UnauthorizedException('가입할 수 없는 이름입니다.');
    }

    return ResponseDto.success();
  }

  checkPassword(dto: CheckPasswordDto): PasswordStrength {
    const password = dto.getPassword();
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/\W/.test(password)) strength++;
    if (/(\w)\1/.test(password)) strength--;

    switch (strength) {
      case 4:
        return '매우 강함';
      case 3:
        return '강함';
      case 2:
        return '보통';
      case 1:
        return '약함';
      default:
        return '매우 약함';
    }
  }

  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const email = dto.getEmail();
    const subject = '[APP] 인증번호 안내';
    const contents = `인증번호는 ${code} 입니다.`;

    await verificationCodeToEmail(email, subject, contents, code, 60 * 5);

    return ResponseDto.success();
  }

  async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const email = dto.getEmail();
    const verificationCode = await redisGetExpire(email);

    if (dto.getVerificationCode() !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    const password = await bcrypt_hash(dto.getPassword());
    const id = uuid_v4_generate();
    const name = dto.getName();

    await redisDelExpire(email);
    await saveUser({
      id,
      email,
      name,
      password,
    });

    return ResponseDto.success();
  }
}
