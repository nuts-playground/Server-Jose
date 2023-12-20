import * as dayjs from 'dayjs';

export const time_now = (): string => {
  // DB와 시간을 맞추기 위함
  return dayjs().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
};
