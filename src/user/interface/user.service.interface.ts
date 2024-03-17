import { Response } from 'express';

export interface UserServiceEmail {
  readonly email: string;
}

export interface UserServicePassword {
  readonly password: string;
}

export interface UserServiceNickName {
  readonly nick_name: string;
}

export interface UserServiceSignUp {
  readonly email: string;
  readonly nick_name: string;
  readonly password: string;
  readonly verificationCode: string;
  readonly about_me?: string;
  readonly profile_image_url?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly delete_yn?: string;
}

export interface UserServiceUpdate {
  readonly id: number;
  nick_name?: string;
  password?: string;
  about_me?: string;
  profile_image_url?: string;
}

export interface UserServiceDelete {
  readonly id: number;
  readonly response: Response;
}

export interface UserServiceSignUpRepository {
  readonly email: string;
  readonly nick_name: string;
  readonly password: string;
  about_me?: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
  delete_yn?: string;
}

export interface UserServiceUpdateRepository {
  readonly id: number;
  nick_name?: string;
  password?: string;
  about_me?: string;
  profile_image_url?: string;
}
