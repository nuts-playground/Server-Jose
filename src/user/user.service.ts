import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserServiceUtil } from './utils/user.service.util';
import { UUIDUtil } from 'src/common/utils/uuid.util';
import { BcryptUtil } from 'src/common/utils/bcrypt.util';

@Injectable()
export class UserService extends UserServiceUtil {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async signUp(dto: SignUpDto) {
    const isAlreadyUser = await this.findOne(dto.getEmail());

    if (isAlreadyUser) {
      throw new UnauthorizedException('이미 가입된 메일입니다.');
    }

    const hashedPassword: string = await BcryptUtil.hash(dto.getPassword());
    await this.saveUser({
      id: UUIDUtil.generate(),
      password: hashedPassword,
      ...dto.getSignUpInfo(),
    });

    return ResponseDto.successWithJSON(dto.getSignUpInfo());
  }

  async signIn(dto: SignInDto) {
    console.log(dto.getEmail);
    console.log(dto.getPassword);
  }
}
