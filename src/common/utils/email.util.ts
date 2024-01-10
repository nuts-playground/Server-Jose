import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { configUtil } from './config.util';
import { SendEmail } from './interfaces/email.util.interface';

export const emailUtil = () => {
  return {
    send: async (sendInfo: SendEmail) => {
      const transporter = nodemailer.createTransport({
        service: configUtil().get<string>('EMAIL_SERVICE'),
        auth: {
          user: configUtil().get<string>('EMAIL_AUTH_USER'),
          pass: configUtil().get<string>('EMAIL_AUTH_PASSWORD'),
        },
      });

      try {
        await transporter.sendMail({
          from: configUtil().get<string>('EMAIL_AUTH_USER'),
          to: sendInfo.email,
          subject: sendInfo.subject,
          html: sendInfo.contents,
        });
      } catch (err) {
        throw new InternalServerErrorException('이메일 전송에 실패했습니다.');
      }
    },
  };
};
