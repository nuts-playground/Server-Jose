export interface UserPrismaUtil {
  findById: (id: number) => Promise<UserPrisma>;
  findByEmail: (email: string) => Promise<UserPrisma>;
  findByName: (nick_name: string) => Promise<UserPrisma>;
  saveUser: (userInfo: UserPrisma) => Promise<UserPrisma>;
  deleteUser: (id: number) => Promise<UserPrisma>;
}

export interface UserPrisma {
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
