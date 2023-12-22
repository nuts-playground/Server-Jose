import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dtos/sign-up.dto';
import {
  ValidateCheckVerificationCode,
  ValidateSendVerificationCode,
  ValidateSignUp,
} from 'src/user/decorator/user.decorator';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { CheckVerificationCodeDto } from './dtos/check-verification-code.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * COMPELTE
   */
  @Post('/signUp')
  async signUp(@ValidateSignUp() dto: SignUpDto): Promise<ResponseDto> {
    return await this.userService.signUp(dto);
  }

  /**
   * COMPELTE
   */
  @Post('/sendVerificationCode')
  async sendVerificationCode(
    @ValidateSendVerificationCode() dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    return await this.userService.sendVerificationCode(dto);
  }

  /**
   * COMPELTE
   */
  @Post('/checkVerificationCode')
  async checkVerificationCode(
    @ValidateCheckVerificationCode() dto: CheckVerificationCodeDto,
  ): Promise<ResponseDto> {
    return await this.userService.checkVerificationCode(dto);
  }

  /**
   * TODO
   */
  @Post('/patchUser')
  async patchUser(): Promise<ResponseDto> {
    return await this.userService.patchUser();
  }
}
