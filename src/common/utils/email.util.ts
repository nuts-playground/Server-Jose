import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getConfig } from '../config/global-config.util';

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  const transporter = nodemailer.createTransport({
    service: getConfig<string>('EMAIL_SERVICE'),
    auth: {
      user: getConfig<string>('EMAIL_AUTH_USER'),
      pass: getConfig<string>('EMAIL_AUTH_PASSWORD'),
    },
  });

  try {
    await transporter.sendMail({
      from: getConfig<string>('EMAIL_AUTH_USER'),
      to: email,
      subject: subject,
      html: html,
    });
  } catch (err) {
    throw new InternalServerErrorException('이메일 전송에 실패했습니다.');
  }
};
