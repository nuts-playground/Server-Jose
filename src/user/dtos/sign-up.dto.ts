import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDtoSignUp } from '../interface/user.dto.interface';

export class UserSignUpDto {
  private readonly email: string;
  private readonly nick_name: string;
  private readonly password: string;
  private readonly verificationCode: string;
  private readonly about_me?: string;
  private readonly profile_image_url?: string;
  private readonly created_at?: string;
  private readonly updated_at?: string;
  private readonly delete_yn?: string;

  constructor(
    email: string,
    nick_name: string,
    password: string,
    verificationCode: string,
    about_me?: string,
    profile_image_url?: string,
    created_at?: string,
    updated_at?: string,
    delete_yn?: string,
  ) {
    this.email = email;
    this.nick_name = nick_name;
    this.password = password;
    this.verificationCode = verificationCode;
    this.about_me = about_me;
    this.profile_image_url = profile_image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.delete_yn = delete_yn;
  }

  @ApiProperty({ name: 'email', default: '' })
  @Expose()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty({ name: 'name', default: '' })
  @Expose()
  getNickName(): string {
    return this.nick_name;
  }

  @ApiProperty({ name: 'password', default: '' })
  @Expose()
  getPassword(): string {
    return this.password;
  }

  @ApiProperty({ name: 'about_me', default: '' })
  @Expose()
  getAboutMe(): string {
    return this.about_me;
  }

  @ApiProperty({ name: 'profile_image_url', default: '' })
  @Expose()
  getProfileImageUrl(): string {
    return this.profile_image_url;
  }

  @ApiProperty({ name: 'created_at', default: '' })
  @Expose()
  getCreatedAt(): string {
    return this.created_at;
  }

  @ApiProperty({ name: 'updated_at', default: '' })
  @Expose()
  getUpdatedAt(): string {
    return this.updated_at;
  }

  @ApiProperty({ name: 'delete_yn', default: '' })
  @Expose()
  getDeleteYn(): string {
    return this.delete_yn;
  }

  @ApiProperty({ name: 'verificationCode', default: '' })
  @Expose()
  getVerificationCode(): string {
    return this.verificationCode;
  }

  @Expose()
  getSignUpUserInfo(): UserDtoSignUp {
    const userInfo = {
      email: this.email,
      nick_name: this.nick_name,
      password: this.password,
      verificationCode: this.verificationCode,
      about_me: this.about_me,
      profile_image_url: this.profile_image_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
      delete_yn: this.delete_yn,
    };

    return userInfo;
  }
}
