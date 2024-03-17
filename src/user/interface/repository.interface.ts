export interface RepositoryUserResponse {
  id?: number;
  email: string;
  nick_name: string;
  password?: string;
  about_me?: string;
  provider?: string;
  profile_image_url?: string;
  created_at?: Date;
  updated_at?: Date;
  delete_yn?: string;
}

export interface UserRepositoryUpdate {
  readonly id: number;
  readonly nick_name?: string;
  readonly password?: string;
  readonly about_me?: string;
  readonly profile_image_url?: string;
}

export interface SignUpUser {
  email: string;
  nick_name: string;
  password?: string;
  provider?: string;
  about_me?: string;
  profile_image_url?: string;
}

export interface UpdateUser {
  email: string;
  nick_name?: string;
  password?: string;
  about_me?: string;
  profile_image_url?: string;
}
