import { ResponseDto } from '../dtos/response.dto';
import { sendEmail } from './email.util';
import { redisSetExpire } from './redis.util';

export const verificationCodeToEmail = async (
  email: string,
  subject: string,
  contents: string,
  code: string,
  time: number,
): Promise<ResponseDto> => {
  await redisSetExpire(email, code, time);
  await sendEmail(email, subject, contents);

  return ResponseDto.success();
};
