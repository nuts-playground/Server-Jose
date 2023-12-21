import { ApiProperty } from '@nestjs/swagger';
import { SignUpResponseInterface } from '../interface/sign-up.interface';

export class SignUpDto {
  private readonly email: string;
  private readonly name: string;
  private readonly password: string;
  private readonly about_me?: string;
  private readonly profile_image_url?: string;
  private readonly created_at?: string;
  private readonly updated_at?: string;
  private readonly delete_yn?: string;

  constructor(
    email: string,
    name: string,
    password: string,
    about_me?: string,
    profile_image_url?: string,
    created_at?: string,
    updated_at?: string,
    delete_yn?: string,
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.about_me = about_me;
    this.profile_image_url = profile_image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.delete_yn = delete_yn;
  }

  @ApiProperty()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty()
  getName(): string {
    return this.name;
  }

  @ApiProperty()
  getPassword(): string {
    return this.password;
  }

  @ApiProperty()
  getAboutMe(): string {
    return this.about_me;
  }

  @ApiProperty()
  getProfileImageUrl(): string {
    return this.profile_image_url;
  }

  @ApiProperty()
  getCreatedAt(): string {
    return this.created_at;
  }

  @ApiProperty()
  getUpdatedAt(): string {
    return this.updated_at;
  }

  @ApiProperty()
  getDeleteYn(): string {
    return this.delete_yn;
  }

  @ApiProperty()
  getSignUpInfo() {
    return {
      email: this.email,
      name: this.name,
      about_me: this.about_me,
      profile_image_url: this.profile_image_url,
      created_dtm: this.created_at,
      updated_dtm: this.updated_at,
      delete_yn: this.delete_yn,
    };
  }

  @ApiProperty()
  responseUserInfo(): SignUpResponseInterface {
    return {
      email: this.email,
      name: this.name,
    };
  }
}
