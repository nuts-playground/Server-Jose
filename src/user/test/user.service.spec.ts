import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { CheckEmailDto } from '../dtos/check-email.dto';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CheckNameDto } from '../dtos/check-name.dto';
import { prisma } from 'src/common/utils/prisma.util';
import { redis } from 'src/common/utils/redis.util';
import { PrismaUser } from 'src/common/utils/interfaces/prisma.util.interface';
import { CheckPasswordDto } from '../dtos/check-password.dto';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import * as nodemailer from 'nodemailer';
import { SignUpDto } from '../dtos/sign-up.dto';

const successResponse = ResponseDto.success();
const user: PrismaUser = {
  id: 1,
  email: 'hello@example.com',
  nick_name: 'hello2',
  password: 'password',
  about_me: 'about me',
  profile_image_url: 'profile image url',
  provider: 'provider',
  created_at: new Date(),
  updated_at: new Date(),
  delete_yn: 'N',
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('이메일 유효성 검사', () => {
    it('이메일이 이미 존재하는 경우', async () => {
      const email = 'hello@naver.com';
      const emailDto = new CheckEmailDto(email);

      prisma.users.findUnique = jest.fn().mockResolvedValue(user);

      try {
        const result = await userService.isAlreadyEmail(emailDto);

        expect(result).toThrow(new Error('테스트 오류: 가입 가능한 이메일'));
      } catch (e) {
        expect(e).toEqual(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );
      }
    });

    it('이메일이 정상인 경우', async () => {
      const email = 'hello@example.com';
      const emailDto = new CheckEmailDto(email);

      prisma.users.findUnique = jest.fn().mockResolvedValue(null);

      try {
        const result = await userService.isAlreadyEmail(emailDto);

        expect(result).toEqual(successResponse);
      } catch (e) {
        expect(e).toThrow(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );
      }
    });
  });

  describe('이름 유효성 검사', () => {
    it('이름이 이미 존재하는 경우', async () => {
      const name = 'hello';
      const nameDto = new CheckNameDto(name);

      prisma.users.findUnique = jest.fn().mockResolvedValue(user);

      try {
        const result = await userService.checkName(nameDto);

        expect(result).toThrow(new Error('테스트 오류: 가입 가능한 이름'));
      } catch (e) {
        expect(e).toEqual(
          new UnauthorizedException('가입할 수 없는 이름입니다.'),
        );
      }
    });

    it('이름이 정상인 경우', async () => {
      const name = 'hello2';
      const nameDto = new CheckNameDto(name);

      prisma.users.findUnique = jest.fn().mockResolvedValue(null);

      try {
        const result = await userService.checkName(nameDto);

        expect(result).toEqual(successResponse);
      } catch (e) {
        expect(e).toThrow(
          new UnauthorizedException('가입할 수 없는 이름입니다.'),
        );
      }
    });
  });

  describe('비밀번호 유효성 검사', () => {
    function passwordCheckTest(password: string) {
      const passwordDto = new CheckPasswordDto(password);
      return userService.checkPassword(passwordDto);
    }

    it('비밀번호가 매우 강함인 경우', () => {
      const password = 'HeloWDrld123!';
      const result = passwordCheckTest(password);

      expect(result).toEqual('매우 강함');
    });

    it('비밀번호가 강함인 경우', () => {
      const password = 'HeloWDrld123';
      const result = passwordCheckTest(password);

      expect(result).toEqual('강함');
    });

    it('비밀번호가 보통인 경우', () => {
      const password = 'helloworld123!';
      const result = passwordCheckTest(password);

      expect(result).toEqual('보통');
    });

    it('비밀번호가 약함인 경우', () => {
      const password = 'helloworld123';
      const result = passwordCheckTest(password);

      expect(result).toEqual('약함');
    });

    it('비밀번호가 매우 약함인 경우', () => {
      const password = 'helloworld';
      const result = passwordCheckTest(password);

      expect(result).toEqual('매우 약함');
    });
  });

  describe('인증번호 메일 전송', () => {
    const email = 'hello@example.com';
    const emailDto = new SendVerificationCodeDto(email);

    it('인증번호 메일 전송 성공', async () => {
      redis.set = jest.fn().mockResolvedValue('OK');
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      try {
        const result = await userService.sendVerificationCode(emailDto);

        expect(result).toEqual(successResponse);
      } catch (error) {
        expect(error).toThrow(
          new InternalServerErrorException('이메일 전송에 실패하였습니다.'),
        );
      }
    });

    it('Redis 저장 실패, 메일 전송 성공', async () => {
      redis.set = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      try {
        const result = await userService.sendVerificationCode(emailDto);

        expect(result).toThrow(new Error('테스트 실패: Redis 저장 성공'));
      } catch (error) {
        expect(error).toEqual(new InternalServerErrorException());
      }
    });

    it('Redis 저장 성공, 메일 전송 실패', async () => {
      redis.set = jest.fn().mockResolvedValue('OK');
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException()),
      });

      try {
        const result = await userService.sendVerificationCode(emailDto);

        expect(result).toThrow(new Error('테스트 실패: 메일 전송 성공'));
      } catch (error) {
        expect(error).toEqual(
          new InternalServerErrorException('이메일 전송에 실패하였습니다.'),
        );
      }
    });

    it('Redis 저장 실패, 메일 전송 실패(redis.set 로직이 먼저 있기에 nodemailer 오류는 나면 안됨)', async () => {
      redis.set = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException()),
      });

      try {
        const result = await userService.sendVerificationCode(emailDto);

        expect(result).toThrow(new Error('테스트 실패: Redis 저장 성공'));
      } catch (error) {
        expect(error).toEqual(new InternalServerErrorException());
      }
    });
  });

  describe('회원가입', () => {
    const email = 'hello@example.com';
    const emailDto = new SignUpDto(
      email,
      'hello2',
      'password',
      'verification code',
    );
    it('회원가입 성공', async () => {
      redis.get = jest.fn().mockResolvedValue('verification code');
      redis.del = jest.fn().mockResolvedValue(1);
      prisma.users.create = jest.fn().mockResolvedValue(user);

      try {
        const result = await userService.signUp(emailDto);

        expect(result).toEqual(successResponse);
      } catch (error) {
        expect(error).toThrow(new Error('테스트 실패: 회원가입 실패'));
      }
    });

    it('인증번호가 틀리거나 없는 경우', async () => {
      redis.get = jest.fn().mockResolvedValue('wrong verification code');
      redis.del = jest.fn().mockResolvedValue(1);
      prisma.users.create = jest.fn().mockResolvedValue(user);

      try {
        const result = await userService.signUp(emailDto);

        expect(result).toThrow(new Error('테스트 실패: 인증번호 같음'));
      } catch (error) {
        expect(error).toEqual(
          new UnauthorizedException('인증번호가 일치하지 않습니다.'),
        );
      }
    });

    it('Redis 연동 실패(Redis 로직이 먼저 있어서 Prisma에러가 나오면 안됨)', async () => {
      redis.get = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      redis.del = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      prisma.users.create = jest
        .fn()
        .mockRejectedValue(new Error('Prisma Error'));

      try {
        const result = await userService.signUp(emailDto);

        expect(result).toThrow(new Error('테스트 실패: 정상처리됨'));
      } catch (error) {
        expect(error).toEqual(new InternalServerErrorException());
      }
    });

    it('DB 연동 실패', async () => {
      redis.get = jest.fn().mockResolvedValue('verification code');
      redis.del = jest.fn().mockResolvedValue(1);
      prisma.users.create = jest.fn().mockRejectedValue(new Error());
      try {
        const result = await userService.signUp(emailDto);

        expect(result).toThrow(new Error('테스트 실패: 정상처리됨'));
      } catch (error) {
        expect(error).toEqual(new InternalServerErrorException());
      }
    });
  });
});
