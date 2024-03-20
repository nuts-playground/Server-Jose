export interface UserRepositoryResponse {
  readonly id: number;
  readonly email: string;
  readonly nick_name: string;
  readonly password?: string;
  readonly about_me?: string;
  readonly provider?: string;
  readonly profile_image_url?: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  readonly delete_yn?: string;
}

export interface UserRepositoryUpdate {
  readonly id: number;
  readonly nick_name?: string;
  readonly password?: string;
  readonly about_me?: string;
  readonly profile_image_url?: string;
}

export interface UserRepositorySignUp {
  readonly email: string;
  readonly nick_name: string;
  readonly password?: string;
  readonly provider?: string;
  readonly about_me?: string;
  readonly profile_image_url?: string;
}

export interface UserRepositryDelete {
  readonly id: number;
}

export interface UserRepositoryFindByEmail {
  readonly email: string;
}

export interface UserRepositoryFindByNickName {
  readonly nick_name: string;
}

export interface UserRepositoryFindById {
  readonly id: number;
}
