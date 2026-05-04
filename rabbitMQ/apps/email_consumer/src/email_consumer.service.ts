import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';

interface UserLoggedInEvent {
  name: string;
  email: string;
  loggedInAt: string;
}

export const EMAIL_TRANSPORTER = 'EMAIL_TRANSPORTER';
export const EMAIL_FROM_ADDRESS = 'EMAIL_FROM_ADDRESS';

@Injectable()
export class EmailConsumerService {
  constructor(
    @Inject(EMAIL_TRANSPORTER)
    private readonly transporter: Transporter | null,
    @Inject(EMAIL_FROM_ADDRESS) private readonly fromEmail: string,
  ) {}

  async sendWelcomeEmail(payload: UserLoggedInEvent) {
    const subject = 'Welcome to our app';
    const text = [
      `Hi ${payload.name},`,
      '',
      'Welcome to our app.',
      `We noticed a successful login for ${payload.email}.`,
      `Login time: ${payload.loggedInAt}`,
      '',
      'Thanks for joining us.',
    ].join('\n');

    if (!this.transporter) {
      console.log(
        `SMTP is not configured. Skipping email send for ${payload.email}.`,
      );
      console.log({ subject, text });
      return;
    }

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: payload.email,
      subject,
      text,
    });

    console.log(`Welcome email sent to ${payload.email}`);
  }
}
