import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { CheckPasswordDto } from '../dtos/check-password.dto';
import { CheckNameDto } from '../dtos/check-name.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Request } from 'express';
import { UserControllerUpdate } from '../interface/user.controller.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/isAlreadyEmail')
  async isAlreadyEmail(@Body() dto: CheckEmailDto): Promise<ResponseDto> {
    const email = dto.getEmail();

    return await this.userService.isAlreadyEmail({ email });
  }

  @Post('/checkName')
  async checkName(@Body() dto: CheckNameDto): Promise<ResponseDto> {
    const nick_name = dto.getNickName();

    return await this.userService.checkName({ nick_name });
  }

  @Post('/checkPassword')
  checkPassword(@Body() dto: CheckPasswordDto): ResponseDto {
    const password = dto.getPassword();

    return this.userService.checkPassword({ password });
  }

  @Post('/sendVerificationCode')
  async sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const email = dto.getEmail();

    return await this.userService.sendVerificationCode({ email });
  }

  @Post('/signUp')
  async signUp(@Body() dto: SignUpDto): Promise<ResponseDto> {
    const signUpInfo = dto.getSignUpUserInfo();

    return await this.userService.signUp(signUpInfo);
  }

  @UseGuards(JwtGuard)
  @Patch('/updateUser')
  async updateUser(
    @Req() request: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseDto> {
    const updateInfo: UserControllerUpdate = {
      id: request.user['id'],
      ...dto.getUpdateInfo(),
    };

    return await this.userService.updateUser(updateInfo);
  }

  @UseGuards(JwtGuard)
  @Delete('/deleteUser')
  async deleteUser(@Req() request: Request): Promise<ResponseDto> {
    const id = request.user['id'];
    return await this.userService.deleteUser({ id });
  }
}
