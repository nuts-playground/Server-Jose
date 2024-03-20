import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserRedisService } from 'src/user/providers/user-redis.service';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { UserService } from 'src/user/providers/user.service';
import * as nodemailer from 'nodemailer';
import { UserRepositoryResponse } from 'src/user/interface/user.repository.interface';
import { UserCheckEmailDto } from 'src/user/dtos/check-email.dto';
import { UserCheckNameDto } from 'src/user/dtos/check-name.dto';
import { UserCheckPasswordDto } from 'src/user/dtos/check-password.dto';
import { UserSendVerificationCodeDto } from 'src/user/dtos/send-verification-code.dto';
import { UserSignUpDto } from 'src/user/dtos/sign-up.dto';
import { AppGlobal } from 'src/global/app.global';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepositoryService;
  let userRedis: UserRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryService,
          useValue: {
            findByEmail: jest.fn(),
            findByName: jest.fn(),
            findById: jest.fn(),
            saveUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: UserRedisService,
          useValue: {
            setVerificationCode: jest.fn(),
            getVerificationCode: jest.fn(),
            deleteVerificationCode: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepositoryService>(UserRepositoryService);
    userRedis = module.get<UserRedisService>(UserRedisService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(userRedis).toBeDefined();
  });

  describe('isAlreadyEmail [이메일 유효성 검사]', () => {
    const dto = new UserCheckEmailDto('hello@example.com');

    it('이메일이 정상일 때', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      expect(
        await userService.isAlreadyEmail({ email: dto.getEmail() }),
      ).toStrictEqual(response);
    });

    it('이미 가입되어 있을 때', async () => {
      const mockValue: UserRepositoryResponse = {
        id: 1,
        email: 'hello@example.com',
        password: 'testPassword',
        nick_name: 'testNickName',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockValue);

      expect(async () => {
        await userService.isAlreadyEmail({ email: dto.getEmail() });
      }).rejects.toThrow(
        new UnauthorizedException('사용할 수 없는 이메일입니다.'),
      );
    });
  });

  describe('checkName [이름 유효성 검사]', () => {
    const dto = new UserCheckNameDto('testUser');

    it('이름이 정상일 때', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      expect(
        await userService.checkName({ nick_name: dto.getNickName() }),
      ).toStrictEqual(response);
    });

    it('이미 있는 이름일 때', async () => {
      const mockValue: UserRepositoryResponse = {
        id: 1,
        email: 'hello@example.com',
        password: 'testPassword',
        nick_name: 'testNickName',
      };

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(mockValue);

      expect(async () => {
        await userService.checkName({ nick_name: dto.getNickName() });
      }).rejects.toThrow(
        new UnauthorizedException('사용할 수 없는 이름입니다.'),
      );
    });
  });

  describe('checkPassword [비밀번호 유효성 검사]', () => {
    it('비밀번호가 매우 강함일 때', () => {
      const dto = new UserCheckPasswordDto('testPasword13!@#');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '매우 강함',
      });

      expect(
        userService.checkPassword({ password: dto.getPassword() }),
      ).toStrictEqual(response);
    });

    it('비밀번호가 강함일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword123!@#');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '강함',
      });

      expect(
        userService.checkPassword({ password: dto.getPassword() }),
      ).toStrictEqual(response);
    });

    it('비밀번호가 보통일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword123');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '보통',
      });

      expect(
        userService.checkPassword({ password: dto.getPassword() }),
      ).toStrictEqual(response);
    });

    it('비밀번호가 약함일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '약함',
      });

      expect(
        userService.checkPassword({ password: dto.getPassword() }),
      ).toStrictEqual(response);
    });

    it('비밀번호가 매우 약함일 때', () => {
      const dto = new UserCheckPasswordDto('test');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '매우 약함',
      });

      expect(
        userService.checkPassword({ password: dto.getPassword() }),
      ).toStrictEqual(response);
    });
  });

  describe('sendVerificationCode [인증번호 전송]', () => {
    const dto = new UserSendVerificationCodeDto('hello@example.com');

    it('인증번호 전송 성공', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRedis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      expect(
        await userService.sendVerificationCode({ email: dto.getEmail() }),
      ).toStrictEqual(response);
    });

    it('인증번호 전송 실패', async () => {
      jest.spyOn(userRedis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockRejectedValue(null),
      });

      expect(async () => {
        await userService.sendVerificationCode({ email: dto.getEmail() });
      }).rejects.toThrow(
        new UnauthorizedException('이메일 전송에 실패하였습니다.'),
      );
    });
  });

  describe('signUp [회원가입]', () => {
    const dto = new UserSignUpDto(
      'hello@example.com',
      'testNickName',
      'testPassword',
      '123',
    );
    const email = dto.getEmail();

    const response = ResponseDto.successWithJSON({ email });

    it('회원가입 성공', async () => {
      const verificationCode = '123';

      jest
        .spyOn(userRedis, 'getVerificationCode')
        .mockResolvedValue(verificationCode);
      jest
        .spyOn(userRepository, 'saveUser')
        .mockResolvedValue({ email, nick_name: dto.getNickName(), id: 1 });

      expect(
        await userService.signUp({ ...dto.getSignUpUserInfo() }),
      ).toStrictEqual(response);
    });

    it('회원가입 실패 (인증번호가 올바르지 않음)', async () => {
      const verificationCode = '456';

      jest
        .spyOn(userRedis, 'getVerificationCode')
        .mockResolvedValue(verificationCode);

      expect(async () => {
        await userService.signUp({ ...dto.getSignUpUserInfo() });
      }).rejects.toThrow(
        new UnauthorizedException('인증번호가 일치하지 않습니다.'),
      );
    });
  });

  afterAll(() => {
    AppGlobal.redis.disconnect();
  });
});
