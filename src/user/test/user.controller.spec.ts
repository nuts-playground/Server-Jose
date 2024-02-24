import { UserController } from '../user.controller';
import { Test } from '@nestjs/testing';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { CheckNameDto } from '../dtos/check-name.dto';
import { CheckPasswordDto } from '../dtos/check-password.dto';
import { PasswordStrength } from 'src/common/unions/password-strength.union';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

const successResponse = ResponseDto.success();

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('이메일 유효성 검사', () => {
    const email = 'hello@example.com';
    const emailDto = new CheckEmailDto(email);

    it('이메일이 이미 존재하는 경우', async () => {
      userService.isAlreadyEmail = jest
        .fn()
        .mockRejectedValue(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );

      try {
        const result = await userController.isAlreadyEmail(emailDto);

        expect(result).toThrow(new Error('테스트 오류: 가입 가능한 이메일'));
      } catch (error) {
        expect(error).toEqual(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );
      }
    });

    it('이메일이 정상인 경우', async () => {
      userService.isAlreadyEmail = jest.fn().mockResolvedValue(successResponse);

      try {
        const result = await userController.isAlreadyEmail(emailDto);

        expect(result).toEqual(successResponse);
      } catch (error) {
        expect(error).toThrow(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );
      }
    });
  });

  describe('이름 유효성 검사', () => {
    const name = 'hello';
    const nameDto = new CheckNameDto(name);

    it('이름이 이미 존재하는 경우', async () => {
      userService.checkName = jest
        .fn()
        .mockRejectedValue(
          new UnauthorizedException('가입할 수 없는 이름입니다.'),
        );

      try {
        const result = await userController.checkName(nameDto);

        expect(result).toThrow(new Error('테스트 오류: 가입 가능한 이름'));
      } catch (error) {
        expect(error).toEqual(
          new UnauthorizedException('가입할 수 없는 이름입니다.'),
        );
      }
    });

    it('이름이 정상인 경우', async () => {
      userService.checkName = jest.fn().mockResolvedValue(successResponse);

      try {
        const result = await userController.checkName(nameDto);

        expect(result).toEqual(successResponse);
      } catch (error) {
        expect(error).toThrow(
          new UnauthorizedException('가입할 수 없는 이름입니다.'),
        );
      }
    });
  });

  describe('비밀번호 유효성 검사', () => {
    const getPasswordDto = (password: string) => {
      return new CheckPasswordDto(password);
    };
    const checkPasswordResponse = (passwordStrength: PasswordStrength) => {
      return ResponseDto.successWithJSON({ passwordStrength });
    };

    it('비밀번호 강도가 매우 강함인 경우', () => {
      userService.checkPassword = jest.fn().mockReturnValue('매우 강함');
      const password = getPasswordDto('HeloWDrld123!');
      const passwordStrength = userController.checkPassword(password);

      expect(passwordStrength).toEqual(checkPasswordResponse('매우 강함'));
    });

    it('비밀번호 강도가 강함인 경우', () => {
      userService.checkPassword = jest.fn().mockReturnValue('강함');
      const password = getPasswordDto('HeloWDrld123');
      const passwordStrength = userController.checkPassword(password);

      expect(passwordStrength).toEqual(checkPasswordResponse('강함'));
    });

    it('비밀번호 강도가 보통인 경우', () => {
      userService.checkPassword = jest.fn().mockReturnValue('보통');
      const password = getPasswordDto('helloworld123!');
      const passwordStrength = userController.checkPassword(password);

      expect(passwordStrength).toEqual(checkPasswordResponse('보통'));
    });

    it('비밀번호 강도가 약함인 경우', () => {
      userService.checkPassword = jest.fn().mockReturnValue('약함');
      const password = getPasswordDto('helloworld123');
      const passwordStrength = userController.checkPassword(password);

      expect(passwordStrength).toEqual(checkPasswordResponse('약함'));
    });

    it('비밀번호 강도가 매우 약함인 경우', () => {
      userService.checkPassword = jest.fn().mockReturnValue('매우 약함');
      const password = getPasswordDto('helloworld');
      const passwordStrength = userController.checkPassword(password);

      expect(passwordStrength).toEqual(checkPasswordResponse('매우 약함'));
    });
  });

  describe('인증번호 메일 전송', () => {
    const verificationCodeDto = new SendVerificationCodeDto(
      'hello@example.com',
    );

    it('인증번호 메일 전송 성공', async () => {
      userService.sendVerificationCode = jest
        .fn()
        .mockResolvedValue(successResponse);

      try {
        const result = await userController.sendVerificationCode(
          verificationCodeDto,
        );

        expect(result).toEqual(successResponse);
      } catch (error) {
        expect(error).toThrow(
          new Error('테스트 오류: 인증번호 메일 전송 실패'),
        );
      }
    });

    it('인증번호 메일 전송 실패', async () => {
      userService.sendVerificationCode = jest
        .fn()
        .mockRejectedValue(
          new UnauthorizedException('이메일 전송에 실패하였습니다.'),
        );

      try {
        const result = await userController.sendVerificationCode(
          verificationCodeDto,
        );

        expect(result).toThrow(
          new Error('테스트 오류: 인증번호 메일 전송 성공'),
        );
      } catch (error) {
        expect(error).toEqual(
          new UnauthorizedException('이메일 전송에 실패하였습니다.'),
        );
      }
    });
  });

  describe('회원가입', () => {
    const userInfo = {
      email: 'hello@example.com',
      password: 'password',
      name: 'hello',
      verificationCode: '1234',
    };
    const signUpDto = new SignUpDto(
      userInfo.email,
      userInfo.name,
      userInfo.password,
      userInfo.verificationCode,
    );
    it('회원가입 성공', async () => {
      userService.signUp = jest.fn().mockResolvedValue(successResponse);
      const result = await userController.signUp(signUpDto);

      try {
        expect(result).toEqual(successResponse);
      } catch (error) {
        new Error('테스트 오류: 회원가입 실패');
      }
    });
    it('회원가입 실패', async () => {
      userService.signUp = jest
        .fn()
        .mockRejectedValue(
          new UnauthorizedException('회원가입에 실패하였습니다.'),
        );

      try {
        const result = await userController.signUp(signUpDto);

        expect(result).toThrow(new Error('테스트 오류: 회원가입 성공'));
      } catch (error) {
        expect(error).toEqual(
          new UnauthorizedException('회원가입에 실패하였습니다.'),
        );
      }
    });
  });
});
