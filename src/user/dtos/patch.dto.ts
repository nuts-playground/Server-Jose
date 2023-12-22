import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PatchDto {
  private readonly email: string;
  private readonly password: string;
  private readonly name: string;
  private readonly about_me?: string;
  private readonly profile_image_url?: string;

  constructor(
    email: string,
    password: string,
    name: string,
    about_me?: string,
    profile_image_url?: string,
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.about_me = about_me;
    this.profile_image_url = profile_image_url;
  }

  @ApiProperty()
  @Expose()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty()
  @Expose()
  getPassword(): string {
    return this.password;
  }

  @ApiProperty()
  @Expose()
  getName(): string {
    return this.name;
  }

  @ApiProperty()
  @Expose()
  getAboutMe(): string {
    return this.about_me;
  }

  @ApiProperty()
  @Expose()
  getProfileImageUrl(): string {
    return this.profile_image_url;
  }
}
