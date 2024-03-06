import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './providers/user.service';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckPasswordDto } from './dtos/check-password.dto';
import { CheckNameDto } from './dtos/check-name.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LocalGuard } from 'src/auth/guard/local.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/isAlreadyEmail')
  async isAlreadyEmail(@Body() dto: CheckEmailDto): Promise<ResponseDto> {
    return await this.userService.isAlreadyEmail(dto);
  }

  @Post('/checkName')
  async checkName(@Body() dto: CheckNameDto): Promise<ResponseDto> {
    return await this.userService.checkName(dto);
  }

  @Post('/checkPassword')
  checkPassword(@Body() dto: CheckPasswordDto): ResponseDto {
    const passwordStrength = this.userService.checkPassword(dto);
    return ResponseDto.successWithJSON({ passwordStrength });
  }

  @Post('/sendVerificationCode')
  async sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    return await this.userService.sendVerificationCode(dto);
  }

  @Post('/signUp')
  async signUp(@Body() dto: SignUpDto): Promise<ResponseDto> {
    return await this.userService.signUp(dto);
  }

  @UseGuards(LocalGuard)
  @Patch('/updateUser')
  async updateUser(@Body() dto: UpdateUserDto): Promise<ResponseDto> {
    return await this.userService.updateUser(dto);
  }

  @UseGuards(LocalGuard)
  @Delete('/deleteUser')
  async deleteUser(@Body() dto: DeleteUserDto): Promise<ResponseDto> {
    return await this.userService.deleteUser(dto);
  }
}
