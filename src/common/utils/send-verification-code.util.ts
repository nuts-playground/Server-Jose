import { InternalServerErrorException } from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';
import { emailUtil } from './email.util';
import { SendVerificationCodeToEmail } from './interfaces/send-verification-code.util.interface';

export const verificationCodeUtil = () => {
  return {
    sendToEmail: async (
      sendInfo: SendVerificationCodeToEmail,
    ): Promise<ResponseDto> => {
      const { email, subject, contents } = sendInfo;

      try {
        await emailUtil().send({ email, subject, contents });
      } catch (err) {
        throw new InternalServerErrorException('이메일 전송에 실패하였습니다.');
      }

      return ResponseDto.success();
    },
  };
};
