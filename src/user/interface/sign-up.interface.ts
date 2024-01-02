export interface SignUpInterface {
  id: string;
  email: string;
  name: string;
  password: string;
  about_me?: string;
  profile_image_url?: string;
  delete_yn?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignUpResponseInterface {
  email: string;
  name: string;
}

export interface SignUpServiceResponseInterface {
  id: string;
  email: string;
  name: string;
  password: string;
  about_me?: string;
  profile_image_url?: string;
  created_at?: Date;
  updated_at?: Date;
  delete_yn?: string;
}
