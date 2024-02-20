export interface PrismaUtil {
  onModuleInit: () => Promise<void>;
  onModuleDestroy: () => Promise<void>;
  findById: (id: number) => Promise<PrismaUser>;
  findByEmail: (email: string) => Promise<PrismaUser>;
  findByName: (nick_name: string) => Promise<PrismaUser>;
  saveUser: (userInfo: PrismaUser) => Promise<PrismaUser>;
}

export interface PrismaUser {
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
