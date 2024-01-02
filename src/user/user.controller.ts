import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateEmail, ValidateName } from 'src/user/decorator/user.decorator';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckPasswordDto } from './dtos/check-password.dto';
import { CheckNameDto } from './dtos/check-name.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/isAlreadyEmail')
  async isAlreadyEmail(
    @ValidateEmail() dto: CheckEmailDto,
  ): Promise<ResponseDto> {
    return await this.userService.isAlreadyEmail(dto);
  }

  @Post('/checkName')
  async checkName(@ValidateName() dto: CheckNameDto): Promise<ResponseDto> {
    return await this.userService.checkName(dto);
  }

  @Post('/checkPassword')
  checkPassword(@Body() dto: CheckPasswordDto): ResponseDto {
    return this.userService.checkPassword(dto);
  }

  @Post('/sendVerificationCode')
  async sendVerificationCode(
    @ValidateEmail() dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    return await this.userService.sendVerificationCode(dto);
  }

  @Post('/signUp')
  async signUp(@Body() dto: SignUpDto): Promise<ResponseDto> {
    return await this.userService.signUp(dto);
  }
}
