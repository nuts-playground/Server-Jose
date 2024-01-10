import * as dayjs from 'dayjs';

export const dateUtil = () => {
  return {
    now: (): string => {
      return dayjs().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    },
  };
};
