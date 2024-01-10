import * as bcrypt from 'bcrypt';
import { BcryptCompare } from './interfaces/bcrypt.util.interface';

export const bcryptUtil = () => {
  return {
    hash: async (password: string): Promise<string> => {
      return await bcrypt.hash(password, 10);
    },
    compare: async (compareInfo: BcryptCompare): Promise<boolean> => {
      return await bcrypt.compare(compareInfo.password, compareInfo.hash);
    },
  };
};
