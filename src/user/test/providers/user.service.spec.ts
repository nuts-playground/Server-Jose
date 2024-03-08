import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CheckEmailDto } from 'src/user/dtos/check-email.dto';
import { CheckNameDto } from 'src/user/dtos/check-name.dto';
import { CheckPasswordDto } from 'src/user/dtos/check-password.dto';
import { SendVerificationCodeDto } from 'src/user/dtos/send-verification-code.dto';
import { RepositoryUserResponse } from 'src/user/interface/repository.interface';
import { UserRedisService } from 'src/user/providers/user-redis.service';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { UserService } from 'src/user/providers/user.service';
import * as nodemailer from 'nodemailer';
import { SignUpDto } from 'src/user/dtos/sign-up.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { DeleteUserDto } from 'src/user/dtos/delete-user.dto';

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
    const dto = new CheckEmailDto('hello@example.com');

    it('이메일이 정상일 때', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      expect(await userService.isAlreadyEmail(dto)).toStrictEqual(response);
    });

    it('이미 가입되어 있을 때', async () => {
      const mockValue: RepositoryUserResponse = {
        email: 'hello@example.com',
        password: 'testPassword',
        nick_name: 'testNickName',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockValue);

      expect(async () => {
        await userService.isAlreadyEmail(dto);
      }).rejects.toThrow(
        new UnauthorizedException('가입할 수 없는 이메일입니다.'),
      );
    });
  });

  describe('checkName [이름 유효성 검사]', () => {
    const dto = new CheckNameDto('testUser');

    it('이름이 정상일 때', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      expect(await userService.checkName(dto)).toStrictEqual(response);
    });

    it('이미 있는 이름일 때', async () => {
      const mockValue: RepositoryUserResponse = {
        email: 'hello@example.com',
        password: 'testPassword',
        nick_name: 'testNickName',
      };

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(mockValue);

      expect(async () => {
        await userService.checkName(dto);
      }).rejects.toThrow(
        new UnauthorizedException('가입할 수 없는 이름입니다.'),
      );
    });
  });

  describe('checkPassword [비밀번호 유효성 검사]', () => {
    it('비밀번호가 매우 강함일 때', () => {
      const dto = new CheckPasswordDto('testPasword13!@#');

      expect(userService.checkPassword(dto)).toBe('매우 강함');
    });

    it('비밀번호가 강함일 때', () => {
      const dto = new CheckPasswordDto('testPassword123!@#');

      expect(userService.checkPassword(dto)).toBe('강함');
    });

    it('비밀번호가 보통일 때', () => {
      const dto = new CheckPasswordDto('testPassword123');

      expect(userService.checkPassword(dto)).toBe('보통');
    });

    it('비밀번호가 약함일 때', () => {
      const dto = new CheckPasswordDto('testPassword');

      expect(userService.checkPassword(dto)).toBe('약함');
    });

    it('비밀번호가 매우 약함일 때', () => {
      const dto = new CheckPasswordDto('test');

      expect(userService.checkPassword(dto)).toBe('매우 약함');
    });
  });

  describe('sendVerificationCode [인증번호 전송]', () => {
    const dto = new SendVerificationCodeDto('hello@example.com');

    it('인증번호 전송 성공', async () => {
      const response = ResponseDto.success();

      jest.spyOn(userRedis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      expect(await userService.sendVerificationCode(dto)).toStrictEqual(
        response,
      );
    });

    it('인증번호 전송 실패', async () => {
      jest.spyOn(userRedis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockRejectedValue(null),
      });

      expect(async () => {
        await userService.sendVerificationCode(dto);
      }).rejects.toThrow(
        new UnauthorizedException('이메일 전송에 실패하였습니다.'),
      );
    });
  });

  describe('signUp [회원가입]', () => {
    const dto = new SignUpDto(
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
        .mockResolvedValue({ email, nick_name: dto.getNickName() });

      expect(await userService.signUp(dto)).toStrictEqual(response);
    });

    it('회원가입 실패 (인증번호가 올바르지 않음)', async () => {
      const verificationCode = '456';

      jest
        .spyOn(userRedis, 'getVerificationCode')
        .mockResolvedValue(verificationCode);

      expect(async () => {
        await userService.signUp(dto);
      }).rejects.toThrow(
        new UnauthorizedException('인증번호가 일치하지 않습니다.'),
      );
    });
  });

  describe('updateUser [회원정보 수정]', () => {
    const dto = new UpdateUserDto('hello@example.com');
    const updatedAt = new Date();

    it('회원정보 수정 성공', async () => {
      const response = ResponseDto.successWithJSON({
        email: dto.getEmail(),
        nick_name: dto.getNickName(),
        about_me: dto.getAboutMe(),
        profile_image_url: dto.getProfileImageUrl(),
        updated_at: updatedAt,
      });

      jest.spyOn(userRepository, 'updateUser').mockResolvedValue({
        email: dto.getEmail(),
        nick_name: dto.getNickName(),
        about_me: dto.getAboutMe(),
        profile_image_url: dto.getProfileImageUrl(),
        updated_at: updatedAt,
      });

      expect(await userService.updateUser(dto)).toStrictEqual(response);
    });

    it('회원정보 수정 실패', async () => {
      jest.spyOn(userRepository, 'updateUser').mockImplementation(() => {
        throw new UnauthorizedException('회원정보 수정에 실패하였습니다.');
      });

      expect(async () => {
        await userService.updateUser(dto);
      }).rejects.toThrow(
        new UnauthorizedException('회원정보 수정에 실패하였습니다.'),
      );
    });
  });

  describe('deleteUser [회원 탈퇴]', () => {
    const dto = new DeleteUserDto('hello@example.com');

    it('회원 탈퇴 성공', async () => {
      const response = ResponseDto.successWithJSON({
        email: dto.getEmail(),
        nick_name: 'helloTest',
      });

      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue({
        email: dto.getEmail(),
        nick_name: 'helloTest',
      });

      expect(await userService.deleteUser(dto)).toStrictEqual(response);
    });

    it('회원 탈퇴 실패', async () => {
      jest.spyOn(userRepository, 'deleteUser').mockImplementation(() => {
        throw new UnauthorizedException('회원 탈퇴에 실패하였습니다.');
      });

      expect(async () => {
        await userService.deleteUser(dto);
      }).rejects.toThrow(
        new UnauthorizedException('회원 탈퇴에 실패하였습니다.'),
      );
    });
  });
});
