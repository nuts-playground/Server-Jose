import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserSendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import { UserCheckEmailDto } from '../dtos/check-email.dto';
import { UserCheckPasswordDto } from '../dtos/check-password.dto';
import { UserCheckNameDto } from '../dtos/check-name.dto';
import { UserSignUpDto } from '../dtos/sign-up.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Request, Response } from 'express';
import { UserControllerUpdate } from '../interface/user.controller.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/isAlreadyEmail')
  async isAlreadyEmail(@Body() dto: UserCheckEmailDto): Promise<ResponseDto> {
    const email = dto.getEmail();

    return await this.userService.isAlreadyEmail({ email });
  }

  @Post('/checkName')
  async checkName(@Body() dto: UserCheckNameDto): Promise<ResponseDto> {
    const nick_name = dto.getNickName();

    return await this.userService.checkName({ nick_name });
  }

  @Post('/checkPassword')
  checkPassword(@Body() dto: UserCheckPasswordDto): ResponseDto {
    const password = dto.getPassword();

    return this.userService.checkPassword({ password });
  }

  @Post('/sendVerificationCode')
  async sendVerificationCode(
    @Body() dto: UserSendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const email = dto.getEmail();

    return await this.userService.sendVerificationCode({ email });
  }

  @Post('/signUp')
  async signUp(@Body() dto: UserSignUpDto): Promise<ResponseDto> {
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
  async deleteUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const id = request.user['id'];
    await this.userService.deleteUser({ id, response });
  }
}
