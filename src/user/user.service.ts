import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserServiceUtil } from './utils/user.service.util';

@Injectable()
export class UserService extends UserServiceUtil {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async signUp(dto: SignUpDto) {
    const isAlreadyUser = await this.findOne(dto.getEmail());

    if (isAlreadyUser) {
      return ResponseDto.fail('이미 가입된 이메일입니다.');
    }

    const { email, name } = await this.saveUser(
      dto.getName(),
      dto.getPassword(),
      dto.getEmail(),
    );

    return ResponseDto.successWithData([{ email, name }]);
  }

  async signIn(dto: SignInDto) {
    console.log(dto.getEmail);
    console.log(dto.getPassword);
  }
}
