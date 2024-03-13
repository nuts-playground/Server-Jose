import * as uuid_1 from 'uuid';
import { GlobalUuidUtil } from './interfaces/uuid.util.interface';

export const globalUuidUtil: GlobalUuidUtil = {
  v1: (): string => uuid_1.v1(),
  v4: (): string => uuid_1.v4(),
  randomNumericString: (): string =>
    Math.floor(100000 + Math.random() * 900000).toString(),
};
