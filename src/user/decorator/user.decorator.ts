import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from 'src/user/dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';

export const ValidateSignUp = createParamDecorator(
  (d: unknown, ctx: ExecutionContext): SignUpDto => {
    const request = ctx.switchToHttp().getRequest();
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,18}/;

    if (!emailRegex.test(request.body.email)) {
      throw new BadRequestException('이메일 형식이 올바르지 않습니다.');
    }

    if (!passwordRegex.test(request.body.password)) {
      throw new BadRequestException('패스워드 형식이 올바르지 않습니다.');
    }

    if (request.body.name.length < 2) {
      throw new BadRequestException('이름이 너무 짧습니다.');
    }

    return new SignUpDto(
      request.body.email,
      request.body.password,
      request.body.name,
    );
  },
);

export const ValidateSignIn = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SignInDto => {
    const request = ctx.switchToHttp().getRequest();
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,18}/;

    if (!emailRegex.test(request.body.email)) {
      throw new UnauthorizedException('사용자 정보가 올바르지 않습니다.');
    }

    if (!passwordRegex.test(request.body.password)) {
      throw new UnauthorizedException('패스워드 형식이 올바르지 않습니다.');
    }

    return new SignInDto(request.body.email, request.body.password);
  },
);
