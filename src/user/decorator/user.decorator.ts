import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { CheckNameDto } from '../dtos/check-name.dto';

export const ValidateEmail = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CheckEmailDto => {
    const request = ctx.switchToHttp().getRequest();
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(request.body.email)) {
      throw new BadRequestException('The email format is incorrect');
    }

    return new CheckEmailDto(request.body.email, request.body.authToken);
  },
);

export const ValidateName = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CheckNameDto => {
    const request = ctx.switchToHttp().getRequest();
    const nameRegex = /^.{4,15}$/;

    if (!nameRegex.test(request.body.name)) {
      throw new BadRequestException('The name format is incorrect');
    }

    return new CheckNameDto(request.body.name, request.body.authToken);
  },
);

//========================================================

// export const ValidateSignUp = createParamDecorator(
//   (_: unknown, ctx: ExecutionContext): SignUpDto => {
//     const request = ctx.switchToHttp().getRequest();
//     const emailRegex = /\S+@\S+\.\S+/;
//     const passwordRegex = /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,18}/;

//     if (!emailRegex.test(request.body.email)) {
//       throw new BadRequestException('이메일 형식이 올바르지 않습니다.');
//     }

//     if (!passwordRegex.test(request.body.password)) {
//       throw new BadRequestException('패스워드 형식이 올바르지 않습니다.');
//     }

//     if (request.body.name.length < 2) {
//       throw new BadRequestException('이름이 너무 짧습니다.');
//     }

//     return new SignUpDto(
//       request.body.email,
//       request.body.name,
//       request.body.password,
//       request.body.about_me,
//       request.body.profile_image_url,
//       request.body.created_at,
//       request.body.updated_at,
//       request.body.delete_yn,
//     );
//   },
// );

// export const ValidateSendVerificationCode = createParamDecorator(
//   (_: unknown, ctx: ExecutionContext): SendVerificationCodeDto => {
//     const request = ctx.switchToHttp().getRequest();
//     const emailRegex = /\S+@\S+\.\S+/;

//     if (!emailRegex.test(request.body.email)) {
//       throw new UnauthorizedException('이메일 형식이 올바르지 않습니다.');
//     }

//     return new SendVerificationCodeDto(request.body.email);
//   },
// );

// export const ValidateCheckVerificationCode = createParamDecorator(
//   (_: unknown, ctx: ExecutionContext): CheckVerificationCodeDto => {
//     const request = ctx.switchToHttp().getRequest();
//     const emailRegex = /\S+@\S+\.\S+/;
//     const verificationCodeRegex = /^\d{6}$/;

//     if (!emailRegex.test(request.body.email)) {
//       throw new UnauthorizedException('이메일 형식이 올바르지 않습니다.');
//     }

//     if (!verificationCodeRegex.test(request.body.verificationCode)) {
//       throw new UnauthorizedException('검증 코드 형식이 올바르지 않습니다.');
//     }

//     return new CheckVerificationCodeDto(
//       request.body.email,
//       request.body.verificationCode,
//     );
//   },
// );
