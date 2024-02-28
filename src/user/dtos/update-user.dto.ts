import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  private readonly email: string;
  private readonly nick_name?: string;
  private readonly password?: string;
  private readonly about_me?: string;
  private readonly profile_image_url?: string;

  constructor(
    email: string,
    nick_name?: string,
    password?: string,
    about_me?: string,
    profile_image_url?: string,
  ) {
    this.email = email;
    this.nick_name = nick_name;
    this.password = password;
    this.about_me = about_me;
    this.profile_image_url = profile_image_url;
  }

  @ApiProperty({ name: 'email', default: '' })
  getEmail(): string {
    return this.email;
  }

  @ApiProperty({ name: 'nick_name', default: '' })
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
}
