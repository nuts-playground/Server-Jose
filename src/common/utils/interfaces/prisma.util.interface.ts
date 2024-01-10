export interface PrismaUser {
  id: number;
  email: string;
  nick_name: string;
  password?: string;
  about_me?: string;
  provider: string;
  profile_image_url?: string;
  created_at?: Date;
  updated_at?: Date;
  delete_yn?: string;
}
