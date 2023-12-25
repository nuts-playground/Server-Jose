import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (err) {
    throw new InternalServerErrorException('이메일 전송에 실패했습니다.');
  }
};
