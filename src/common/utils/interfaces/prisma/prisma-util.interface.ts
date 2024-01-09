export interface PrismaResponseUserInterface {
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

export interface PrismaSaveUserInterface {
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
