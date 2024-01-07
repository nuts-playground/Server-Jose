import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('/signIn')
  async signIn(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto> {
    response.cookie('access_token', request.user.access_token, {
      httpOnly: true,
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_NUMBER_IN),
    });
    response.cookie('refresh_token', request.user.refresh_token, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_NUMBER_IN),
    });

    return ResponseDto.successWithJSON({ email: request.user.email });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/profile')
  async getProfile(@Req() request): Promise<ResponseDto> {
    return ResponseDto.success();
  }
}
