import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';

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
      const email = 'hello2@naver.com';
      const emailDto = new CheckEmailDto(email);

      try {
        const result = await userService.isAlreadyEmail(emailDto);

        expect(result).toEqual(ResponseDto.success());
      } catch (e) {
        expect(e).toThrow(
          new UnauthorizedException('가입할 수 없는 이메일입니다.'),
        );
      }
    });
  });
});
