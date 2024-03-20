import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserService } from '../../providers/user.service';
import { UserController } from '../../controllers/user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCheckEmailDto } from 'src/user/dtos/check-email.dto';
import { UserCheckNameDto } from 'src/user/dtos/check-name.dto';
import { UserCheckPasswordDto } from 'src/user/dtos/check-password.dto';
import { UserSendVerificationCodeDto } from 'src/user/dtos/send-verification-code.dto';
import { UserSignUpDto } from 'src/user/dtos/sign-up.dto';
import { AppGlobal } from 'src/global/app.global';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            isAlreadyEmail: jest.fn(),
            checkName: jest.fn(),
            sendVerificationCode: jest.fn(),
            checkPassword: jest.fn(),
            updateUser: jest.fn(),
            signUp: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('isAlreadyEmail [이메일 유효성 검사]', () => {
    it('이메일이 정상일 때', async () => {
      const dto = new UserCheckEmailDto('hello@example.com');
      const serviceResponse = ResponseDto.success();

      jest
        .spyOn(userService, 'isAlreadyEmail')
        .mockResolvedValue(serviceResponse);

      expect(await userController.isAlreadyEmail(dto)).toStrictEqual(
        serviceResponse,
      );
    });

    it('이미 가입되어 있거나 형식에 맞지 않을 때', async () => {
      const dto = new UserCheckEmailDto('hello@example.com');

      jest.spyOn(userService, 'isAlreadyEmail').mockImplementation(() => {
        throw new UnauthorizedException('가입할 수 없는 이메일입니다.');
      });

      expect(async () => {
        await userController.isAlreadyEmail(dto);
      }).rejects.toThrow(
        new UnauthorizedException('가입할 수 없는 이메일입니다.'),
      );
    });
  });

  describe('checkName [이름 유효성 검사]', () => {
    it('이름이 정상일 때', async () => {
      const dto = new UserCheckNameDto('testUser');
      const serviceResponse = ResponseDto.success();

      jest.spyOn(userService, 'checkName').mockResolvedValue(serviceResponse);

      expect(await userController.checkName(dto)).toStrictEqual(
        serviceResponse,
      );
    });

    it('이미 있는 이름이거나 형식에 맞지 않을 때', async () => {
      const dto = new UserCheckNameDto('testUser');

      jest.spyOn(userService, 'checkName').mockImplementation(() => {
        throw new UnauthorizedException('가입할 수 없는 이름입니다.');
      });

      expect(async () => {
        await userController.checkName(dto);
      }).rejects.toThrow(
        new UnauthorizedException('가입할 수 없는 이름입니다.'),
      );
    });
  });

  describe('checkPassword [비밀번호 유효성 검사]', () => {
    it('강도가 "매우 강함" 일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const repsonse = ResponseDto.successWithJSON({
        passwordStrength: '매우 강함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue(repsonse);

      expect(userController.checkPassword(dto)).toStrictEqual(repsonse);
    });

    it('강도가 "강함" 일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '강함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue(response);

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "보통" 일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '보통',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue(response);

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "약함" 일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '약함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue(response);

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "매우 약함" 일 때', () => {
      const dto = new UserCheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '매우 약함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue(response);

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });
  });

  describe('sendVerificationCode [인증번호 전송]', () => {
    it('인증번호 전송 성공', async () => {
      const dto = new UserSendVerificationCodeDto('hello@example.com');
      const response = ResponseDto.success();

      jest
        .spyOn(userService, 'sendVerificationCode')
        .mockResolvedValue(response);

      expect(await userController.sendVerificationCode(dto)).toStrictEqual(
        response,
      );
    });

    it('인증번호 전송 실패', async () => {
      const dto = new UserSendVerificationCodeDto('hello@example.com');

      jest.spyOn(userService, 'sendVerificationCode').mockImplementation(() => {
        throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
      });

      expect(async () => {
        await userController.sendVerificationCode(dto);
      }).rejects.toThrow(
        new UnauthorizedException('인증번호가 일치하지 않습니다.'),
      );
    });
  });

  describe('signUp [회원가입]', () => {
    it('회원가입 성공', async () => {
      const signUpDto = new UserSignUpDto(
        'hello@example.com',
        'testUser',
        'testPassword',
        '1234',
      );
      const response = ResponseDto.successWithJSON({
        email: signUpDto.getEmail(),
      });

      jest.spyOn(userService, 'signUp').mockResolvedValue(response);

      expect(await userController.signUp(signUpDto)).toStrictEqual(response);
    });

    it('회원가입 실패', async () => {
      const signUpDto = new UserSignUpDto(
        'hello@example.com',
        'testUser',
        'testPassword',
        '1234',
      );

      jest.spyOn(userService, 'signUp').mockImplementation(() => {
        throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
      });

      expect(async () => {
        await userController.signUp(signUpDto);
      }).rejects.toThrow(
        new UnauthorizedException('인증번호가 일치하지 않습니다.'),
      );

      jest.spyOn(userService, 'signUp').mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      expect(async () => {
        await userController.signUp(signUpDto);
      }).rejects.toThrow(new InternalServerErrorException());
    });
  });

  // UserUpdate, UserDelete는 e2e에서 진행

  afterAll(async () => {
    AppGlobal.redis.disconnect();
  });
});
