import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserRepositoryService } from './user-repository.service';
import { UserRedisService } from './user-redis.service';
import { GlobalConfig } from 'src/global/config.global';
import { globalUuidUtil } from 'src/common/utils/uuid.util';
import { globalEmailUtil } from 'src/common/utils/email.util';
import { globalBcryptUtil } from 'src/common/utils/bcrypt.util';
import {
  UserServiceDelete,
  UserServiceEmail,
  UserServiceNickName,
  UserServicePassword,
  UserServiceSignUp,
  UserServiceSignUpRepository,
  UserServiceUpdate,
  UserServiceUpdateRepository,
} from '../interface/user.service.interface';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly userRedis: UserRedisService,
  ) {}

  async isAlreadyEmail(userInfo: UserServiceEmail): Promise<ResponseDto> {
    const email = userInfo.email;
    const isAlreadyEmail = await this.userRepository.findByEmail({ email });

    if (isAlreadyEmail) {
      throw new UnauthorizedException('사용할 수 없는 이메일입니다.');
    }

    return ResponseDto.success();
  }

  async checkName(userInfo: UserServiceNickName): Promise<ResponseDto> {
    const nick_name = userInfo.nick_name;
    const isAlreadyName = await this.userRepository.findByName({ nick_name });

    if (isAlreadyName) {
      throw new UnauthorizedException('사용할 수 없는 이름입니다.');
    }

    return ResponseDto.success();
  }

  checkPassword(userInfo: UserServicePassword): ResponseDto {
    const password = userInfo.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/\W/.test(password)) strength++;
    if (/(\w)\1/.test(password)) strength--;

    switch (strength) {
      case 4:
        return ResponseDto.successWithJSON({ passwordStrength: '매우 강함' });
      case 3:
        return ResponseDto.successWithJSON({ passwordStrength: '강함' });
      case 2:
        return ResponseDto.successWithJSON({ passwordStrength: '보통' });
      case 1:
        return ResponseDto.successWithJSON({ passwordStrength: '약함' });
      default:
        return ResponseDto.successWithJSON({ passwordStrength: '매우 약함' });
    }
  }

  async sendVerificationCode(userInfo: UserServiceEmail): Promise<ResponseDto> {
    const email = userInfo.email;
    const code = globalUuidUtil.randomNumericString();

    await this.userRedis.setVerificationCode({
      email,
      verificationCode: code,
      time: 60 * 5,
    });
    await globalEmailUtil.send({
      email,
      subject: '[APP] 인증번호 안내',
      contents: `인증번호는 ${code} 입니다.`,
    });

    return ResponseDto.success();
  }

  async signUp(userInfo: UserServiceSignUp): Promise<ResponseDto> {
    const userEmail = userInfo.email;
    const verificationCode = await this.userRedis.getVerificationCode({
      email: userEmail,
    });

    if (!verificationCode)
      throw new UnauthorizedException('인증번호 유효기간이 만료되었습니다.');
    if (userInfo.verificationCode !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    const nick_name = userInfo.nick_name;
    const userPassword = userInfo.password;
    const proFileImageUrl = userInfo.profile_image_url;
    const aboutMe = userInfo.about_me;
    const password = await globalBcryptUtil.hash(userPassword);
    const userBasicInfo: UserServiceSignUpRepository = {
      email: userEmail,
      nick_name,
      password,
    };

    if (aboutMe) userBasicInfo.about_me = aboutMe;
    if (proFileImageUrl) {
      const uuid = globalUuidUtil.v4();
      const imageUrl = `${GlobalConfig.env.imageServerUrl}/${uuid}`;
      userBasicInfo.profile_image_url = imageUrl;
    }
    const { email } = await this.userRepository.saveUser(userInfo);

    await this.userRedis.deleteVerificationCode({ email });

    return ResponseDto.successWithJSON({ email });
  }

  async updateUser(userInfo: UserServiceUpdate): Promise<ResponseDto> {
    const userId = userInfo.id;
    const updateUserInfo: UserServiceUpdateRepository = {
      id: userId,
    };

    if (userInfo.nick_name) updateUserInfo.nick_name = userInfo.nick_name;
    if (userInfo.password)
      updateUserInfo.password = await globalBcryptUtil.hash(userInfo.password);
    if (userInfo.about_me) updateUserInfo.about_me = userInfo.about_me;
    if (userInfo.profile_image_url) {
      const uuid = globalUuidUtil.v4();
      const imageUrl = `${GlobalConfig.env.imageServerUrl}/${uuid}`;
      updateUserInfo.profile_image_url = imageUrl;
    }

    const user = await this.userRepository.updateUser(userInfo);

    if (!user) {
      throw new UnauthorizedException('계정 수정에 실패하였습니다.');
    }

    const { email, nick_name, about_me, profile_image_url, updated_at } = user;

    return ResponseDto.successWithJSON({
      email,
      nick_name,
      about_me,
      profile_image_url,
      updated_at,
    });
  }

  async deleteUser(userInfo: UserServiceDelete): Promise<ResponseDto> {
    const userId = userInfo.id;
    const user = await this.userRepository.deleteUser({ id: userId });

    if (!user) {
      throw new UnauthorizedException('계정 삭제에 실패하였습니다.');
    }

    const { id, email, nick_name } = user;

    await this.userRedis.deleteToken({ id: id.toString() });

    userInfo.response.clearCookie('access_token');
    userInfo.response.clearCookie('refresh_token');

    return ResponseDto.successWithJSON({ email, nick_name });
  }
}
