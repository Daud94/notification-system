import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotificationPayload } from '../../interfaces/notification.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      // Configure your email service here
      host: this.configService.get<string>('SMTP_HOST'),
      port: parseInt(this.configService.get<string>('SMTP_PORT')!, 10),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        to: payload.data?.user.email,
        subject: payload.title,
        text: payload.body,
      });
      return true;
    } catch (error) {
      console.error('Email notification failed:', error);
      return false;
    }
  }
}
