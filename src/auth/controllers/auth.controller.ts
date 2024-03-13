import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Request, Response } from 'express';
import { JwtGuard } from '../guard/jwt.guard';
import { AuthService } from '../providers/auth.service';
import { LocalGuard } from '../guard/local.guard';
import {
  GithubGuard,
  GoogleGuard,
  KakaoGuard,
  NaverGuard,
} from '../guard/social.guard';

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
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) response: Response) {
    await this.authService.signOut(response);
  }

  @UseGuards(JwtGuard)
  @Get('/profile')
  async getProfile(@Req() request: Request): Promise<ResponseDto> {
    const userProfile = await this.authService.getProfile(request.user['id']);

    return ResponseDto.successWithJSON(userProfile);
  }

  @Get('/refreshToken')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    await this.authService.refreshToken(response, refreshToken);
  }

  @UseGuards(GoogleGuard)
  @Get('/google')
  googleLogin() {}

  @UseGuards(GoogleGuard)
  @Get('/google/callback')
  async googleLoginCallback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return await this.authService.googleLogin(request, response);
  }

  @UseGuards(GithubGuard)
  @Get('/github')
  githubLogin() {}

  @UseGuards(GithubGuard)
  @Get('/github/callback')
  async githubLoginCallback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.authService.githubLogin(request, response);
  }

  @UseGuards(KakaoGuard)
  @Get('/kakao')
  kakaoLogin() {}

  @UseGuards(KakaoGuard)
  @Get('/kakao/callback')
  async kakaoLoginCallback(@Req() request: Request, @Res() response: Response) {
    await this.authService.kakaoLogin(request, response);
  }

  @UseGuards(NaverGuard)
  @Get('/naver')
  naverLogin() {}

  @UseGuards(NaverGuard)
  @Get('/naver/callback')
  async naverLoginCallback(@Req() request: Request, @Res() response: Response) {
    await this.authService.naverLogin(request, response);
  }
}
