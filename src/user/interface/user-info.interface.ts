export interface EmailInterface {
  readonly email: string;
}

export interface PasswordInterface {
  readonly password: string;
}

export interface NickNameInterface {
  readonly nick_name: string;
}

export interface SignUpUserInterface {
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

export interface SignUpBasicInfoInterface {
  readonly email: string;
  readonly nick_name: string;
  readonly password: string;
  about_me?: string;
  profile_image_url?: string;
}
