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
  constructor(prisma: PrismaService, private readonly redis: RedisService) {
    super(prisma);
  }

  /**
   * Handles user sign-up.
   * @param dto - The SignUpDto object containing the necessary information for sign-up.
   * @returns A Promise object containing the result of the sign-up process as a ResponseDto object.
   * @throws UnauthorizedException - Throws an exception if the email is already registered.
   */
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

  /**
   * Sends a verification code to the specified email address.
   * @param email - The email address to send the verification code to.
   * @returns A Promise that resolves to any value.
   */
  async sendVerificationCode(email: string): Promise<any> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.setExpire(email, code, 60 * 5);
    const getRedis = await this.redis.getExpire(email);
    console.log(getRedis);
    return ResponseDto.success('인증번호가 발송되었습니다.');
  }

  /**
   * Verifies the email by comparing the verification code with the stored code.
   * If the codes match, the verification code is deleted from Redis.
   * @param email - The email to be verified.
   * @param verificationsCode - The verification code to compare with the stored code.
   * @returns A Promise that resolves to any value.
   * @throws UnauthorizedException if the verification code does not match the stored code.
   */
  async verifyEmail(email: string, verificationsCode: string): Promise<any> {
    const storedCode = await this.redis.getExpire(email);

    if (storedCode !== verificationsCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.redis.delExpire(email);
    }

    return ResponseDto.success('이메일 인증이 완료되었습니다.');
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
