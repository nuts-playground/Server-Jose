import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Request, Response } from 'express';
import { JwtGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/signIn')
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signIn(request, response);
  }

  @UseGuards(JwtGuard)
  @Get('/profile')
  async getProfile(@Req() request: Request): Promise<ResponseDto> {
    const userProfile = await this.authService.getProfile(request.user['id']);

    return ResponseDto.successWithJSON(userProfile);
  }

  @Get('/refreshToken')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies['refresh_token'];

    await this.authService.refreshToken(response, refreshToken);
  }
}
