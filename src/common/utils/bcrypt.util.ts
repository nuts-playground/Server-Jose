import * as bcrypt from 'bcrypt';
import { GlobalBcryptUtils } from './interfaces/bcrypt.util.interface';

export const globalBcryptUtil: GlobalBcryptUtils = {
  hash: async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  },
  compare: async ({ password, hash }): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },
};
