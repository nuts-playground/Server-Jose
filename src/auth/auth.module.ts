import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { configUtil } from 'src/common/utils/config.util';
import { GithubStrategy } from './strategies/github.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { SocialLoginService } from './providers/social-login.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: configUtil().getJwtSecretKey('access'),
      global: false,
    }),
  ],
  providers: [
    AuthService,
    UserRepositoryService,
    SocialLoginService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    KakaoStrategy,
    NaverStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
