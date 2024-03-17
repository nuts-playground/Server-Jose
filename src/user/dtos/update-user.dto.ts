import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDtoUpdate } from '../interface/user.dto.interface';

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
  @Expose()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty({ name: 'nick_name', default: '' })
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

  @Expose()
  getUpdateInfo(): UserDtoUpdate {
    return {
      nick_name: this.nick_name,
      password: this.password,
      about_me: this.about_me,
      profile_image_url: this.profile_image_url,
    };
  }
}
