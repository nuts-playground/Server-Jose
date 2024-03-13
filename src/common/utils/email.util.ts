import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { GlobalConfig } from 'src/global/config.global';
import { EmailUtil } from './interfaces/email.util.interface';

export const globalEmailUtil: EmailUtil = {
  send: async ({ email, subject, contents }) => {
    const transporter = nodemailer.createTransport({
      service: GlobalConfig.env.emailService,
      auth: {
        user: GlobalConfig.env.emailUser,
        pass: GlobalConfig.env.emailPassword,
      },
    });

    try {
      await transporter.sendMail({
        from: GlobalConfig.env.emailUser,
        to: email,
        subject: subject,
        html: contents,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('이메일 전송에 실패하였습니다.');
    }
  },
};
