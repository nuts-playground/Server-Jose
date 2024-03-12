import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmail } from './interfaces/email.util.interface';
import { ConfigGlobal } from 'src/global/config.global';

export const emailUtil = () => {
  return {
    send: async (sendInfo: SendEmail) => {
      const transporter = nodemailer.createTransport({
        service: ConfigGlobal.env.emailService,
        auth: {
          user: ConfigGlobal.env.emailUser,
          pass: ConfigGlobal.env.emailPassword,
        },
      });

      try {
        await transporter.sendMail({
          from: ConfigGlobal.env.emailUser,
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
