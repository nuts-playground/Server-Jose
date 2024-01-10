import { ResponseDto } from '../dtos/response.dto';
import { emailUtil } from './email.util';
import { SendVerificationCodeToEmail } from './interfaces/send-verification-code.util.interface';
import { redisUtil } from './redis.util';

export const verificationCodeToEmail = async (
  sendInfo: SendVerificationCodeToEmail,
): Promise<ResponseDto> => {
  const { email, subject, contents, verificationCode, expireTime } = sendInfo;

  await redisUtil().setExpire({
    key: email,
    value: verificationCode,
    time: expireTime,
  });
  await emailUtil().send({ email, subject, contents });

  return ResponseDto.success();
};
