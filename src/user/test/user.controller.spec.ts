import { UserController } from '../user.controller';
import { Test } from '@nestjs/testing';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';

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
});
