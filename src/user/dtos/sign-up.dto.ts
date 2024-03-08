import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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
  getEmail(): string {
    return this.email;
  }

  @ApiProperty({ name: 'name', default: '' })
  getNickName(): string {
    return this.nick_name;
  }

  @ApiProperty({ name: 'password', default: '' })
  getPassword(): string {
    return this.password;
  }

  @ApiProperty({ name: 'about_me', default: '' })
  getAboutMe(): string {
    return this.about_me;
  }

  @ApiProperty({ name: 'profile_image_url', default: '' })
  getProfileImageUrl(): string {
    return this.profile_image_url;
  }

  @ApiProperty({ name: 'created_at', default: '' })
  getCreatedAt(): string {
    return this.created_at;
  }

  @ApiProperty({ name: 'updated_at', default: '' })
  getUpdatedAt(): string {
    return this.updated_at;
  }

  @ApiProperty({ name: 'delete_yn', default: '' })
  getDeleteYn(): string {
    return this.delete_yn;
  }

  @ApiProperty({ name: 'verificationCode', default: '' })
  getVerificationCode(): string {
    return this.verificationCode;
  }
}
