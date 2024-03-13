import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { CheckPasswordDto } from '../dtos/check-password.dto';
import { CheckNameDto } from '../dtos/check-name.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { verificationCodeUtil } from 'src/common/utils/send-verification-code.util';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { uuidUtil } from 'src/common/utils/uuid.util';
import { UserRepositoryService } from './user-repository.service';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SignUpUser, UpdateUser } from '../interface/repository.interface';
import { UserRedisService } from './user-redis.service';
import { ConfigGlobal } from 'src/global/config.global';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly userRedis: UserRedisService,
  ) {}

  async isAlreadyEmail(dto: CheckEmailDto): Promise<ResponseDto> {
    const email = dto.getEmail();
    const isAlreadyEmail = await this.userRepository.findByEmail(email);

    if (isAlreadyEmail) {
      throw new UnauthorizedException('사용할 수 없는 이메일입니다.');
    }

    return ResponseDto.success();
  }

  async checkName(dto: CheckNameDto): Promise<ResponseDto> {
    const userName = dto.getNickName();
    const isAlreadyName = await this.userRepository.findByName(userName);

    if (isAlreadyName) {
      throw new UnauthorizedException('사용할 수 없는 이름입니다.');
    }

    return ResponseDto.success();
  }

  checkPassword(dto: CheckPasswordDto): ResponseDto {
    const password = dto.getPassword();
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

  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<ResponseDto> {
    const code = uuidUtil().randomNumericString();
    const email = dto.getEmail();
    const emailInfo = {
      email,
      subject: '[APP] 인증번호 안내',
      contents: `인증번호는 ${code} 입니다.`,
    };
    const redisInfo = {
      key: email,
      value: code,
      time: 60 * 5,
    };

    await this.userRedis.setVerificationCode(redisInfo);
    await verificationCodeUtil().sendToEmail(emailInfo);

    return ResponseDto.success();
  }

  async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const userEmail = dto.getEmail();
    const verificationCode = await this.userRedis.getVerificationCode(
      userEmail,
    );

    if (!verificationCode)
      throw new UnauthorizedException('인증번호 유효기간이 만료되었습니다.');
    if (dto.getVerificationCode() !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    const nick_name = dto.getNickName();
    const userPassword = dto.getPassword();
    const proFileImageUrl = dto.getProfileImageUrl();
    const aboutMe = dto.getAboutMe();
    const password = await bcryptUtil().hash(userPassword);
    const userInfo: SignUpUser = {
      email: userEmail,
      nick_name,
      password,
    };

    if (aboutMe) userInfo.about_me = aboutMe;
    if (proFileImageUrl) {
      const imageUrl = `${ConfigGlobal.env.imageServerUrl}/${uuidUtil().v4()}`;
      userInfo.profile_image_url = imageUrl;
    }

    await this.userRedis.deleteVerificationCode(userEmail);

    const { email } = await this.userRepository.saveUser(userInfo);

    return ResponseDto.successWithJSON({ email });
  }

  async updateUser(dto: UpdateUserDto): Promise<ResponseDto> {
    const requestEmail = dto.getEmail();
    const requestNickName = dto.getNickName();
    const requestPassword = dto.getPassword();
    const requestAboutMe = dto.getAboutMe();
    const requestProfileImage = dto.getProfileImageUrl();
    const userInfo: UpdateUser = {
      email: requestEmail,
    };

    if (requestNickName) userInfo.nick_name = requestNickName;
    if (requestPassword)
      userInfo.password = await bcryptUtil().hash(requestPassword);
    if (requestAboutMe) userInfo.about_me = requestAboutMe;
    if (requestProfileImage) {
      const imageUrl = `${ConfigGlobal.env.imageServerUrl}/${uuidUtil().v4()}`;
      userInfo.profile_image_url = imageUrl;
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

  async deleteUser(dto: DeleteUserDto): Promise<ResponseDto> {
    const userEmail = dto.getEmail();
    const user = await this.userRepository.deleteUser(userEmail);

    if (!user) {
      throw new UnauthorizedException('계정 삭제에 실패하였습니다.');
    }

    const { id, email, nick_name } = user;

    await this.userRedis.deleteVerificationCode(id.toString());

    return ResponseDto.successWithJSON({ email, nick_name });
  }
}
