import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { AuthGuard } from './guard/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/signIn')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto> {
    const tokens = await this.authService.signIn(dto);

    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_NUMBER_IN),
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_NUMBER_IN),
    });

    return ResponseDto.success();
  }

  @UseGuards(AuthGuard)
  @Post('/profile')
  async getProfile(@Body() dto: SignInDto): Promise<ResponseDto> {
    return await this.authService.getProfile(dto);
  }
}
