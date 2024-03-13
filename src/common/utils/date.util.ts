import * as dayjs from 'dayjs';
import { GlobalDayJsUtil } from './interfaces/date.util.interface';

export const globalDayJsUtil: GlobalDayJsUtil = {
  now: (): string => dayjs().format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
};
