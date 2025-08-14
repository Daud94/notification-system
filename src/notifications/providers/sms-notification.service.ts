import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { NotificationPayload } from '../../interfaces/notification.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsNotificationService {
  private client: Twilio;

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      await this.client.messages.create({
        body: `${payload.title}\n${payload.body}`,
        to: payload.data?.user.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      return true;
    } catch (error) {
      console.error('SMS notification failed:', error);
      return false;
    }
  }
}
