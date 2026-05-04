import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailConsumerController } from './email_consumer.controller';
import {
  EMAIL_FROM_ADDRESS,
  EMAIL_TRANSPORTER,
  EmailConsumerService,
} from './email_consumer.service';

@Module({
  imports: [],
  controllers: [EmailConsumerController],
  providers: [
    {
      provide: EMAIL_TRANSPORTER,
      useFactory: () => {
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number(process.env.SMTP_PORT ?? '587');
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpHost || !smtpUser || !smtpPass) {
          return null;
        }

        return nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
      },
    },
    {
      provide: EMAIL_FROM_ADDRESS,
      useFactory: () =>
        process.env.SMTP_FROM ??
        process.env.SMTP_USER ??
        'no-reply@example.com',
    },
    EmailConsumerService,
  ],
})
export class EmailConsumerModule {}
