import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { configUtil } from './config.util';
import { SendEmail } from './interfaces/email.util.interface';

export const emailUtil = () => {
  return {
    send: async (sendInfo: SendEmail) => {
      const transporter = nodemailer.createTransport({
        service: configUtil().getEmail<string>('service'),
        auth: {
          user: configUtil().getEmail<string>('user'),
          pass: configUtil().getEmail<string>('pass'),
        },
      });

      try {
        await transporter.sendMail({
          from: configUtil().getEmail<string>('user'),
          to: sendInfo.email,
          subject: sendInfo.subject,
          html: sendInfo.contents,
        });
      } catch (err) {
        throw new InternalServerErrorException('이메일 전송에 실패하였습니다.');
      }
    },
  };
};
