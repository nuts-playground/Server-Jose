import { ResponseDto } from 'src/common/dtos/response.dto';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { UserService } from '../providers/user.service';
import { UserController } from '../user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CheckNameDto } from '../dtos/check-name.dto';
import { CheckPasswordDto } from '../dtos/check-password.dto';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';

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
            checkPassword: jest.fn(),
            sendVerificationCode: jest.fn(),
            signUp: jest.fn(),
            updateUser: jest.fn(),
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
      const dto = new CheckEmailDto('hello@example.com');
      const response = ResponseDto.success();

      jest.spyOn(userService, 'isAlreadyEmail').mockResolvedValue(response);

      expect(await userController.isAlreadyEmail(dto)).toBe(response);
    });

    it('이미 가입되어 있거나 형식에 맞지 않을 때', async () => {
      const dto = new CheckEmailDto('hello@mm.com');

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
      const dto = new CheckNameDto('testUser');
      const response = ResponseDto.success();

      jest.spyOn(userService, 'checkName').mockResolvedValue(response);

      expect(await userController.checkName(dto)).toBe(response);
    });

    it('이미 있는 이름이거나 형식에 맞지 않을 때', async () => {
      const dto = new CheckNameDto('testUser');

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
      const dto = new CheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '매우 강함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue('매우 강함');

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "강함" 일 때', () => {
      const dto = new CheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '강함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue('강함');

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "보통" 일 때', () => {
      const dto = new CheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '보통',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue('보통');

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "약함" 일 때', () => {
      const dto = new CheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '약함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue('약함');

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });

    it('강도가 "매우 약함" 일 때', () => {
      const dto = new CheckPasswordDto('testPassword');
      const response = ResponseDto.successWithJSON({
        passwordStrength: '매우 약함',
      });

      jest.spyOn(userService, 'checkPassword').mockReturnValue('매우 약함');

      expect(userController.checkPassword(dto)).toStrictEqual(response);
    });
  });

  describe('sendVerificationCode [인증번호 전송]', () => {
    it('인증번호 전송 성공', async () => {
      const dto = new SendVerificationCodeDto('hello@example.com');
      const response = ResponseDto.success();

      jest
        .spyOn(userService, 'sendVerificationCode')
        .mockResolvedValue(response);

      expect(await userController.sendVerificationCode(dto)).toBe(response);
    });

    it('인증번호 전송 실패', async () => {
      const dto = new SendVerificationCodeDto('hello@example.com');

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
});
