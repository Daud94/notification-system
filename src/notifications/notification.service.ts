import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  NotificationPayload,
  NotificationPreferences,
} from '../interfaces/notification.interface';
import { EmailNotificationService } from './providers/email-notification.service';
import { SmsNotificationService } from './providers/sms-notification.service';
import { FirebaseNotificationService } from './providers/firebase-notification.service';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
    private readonly emailService: EmailNotificationService,
    private readonly smsService: SmsNotificationService,
    private readonly firebaseService: FirebaseNotificationService,
    private readonly userService: UserService,
  ) {}

  async sendNotification(
    userId: string,
    payload: NotificationPayload,
  ): Promise<void> {
    console.log(
      `Sending notification to user ${userId} with payload:`,
      payload,
    );
    const user = payload.data?.user;

    const request = {
      payload: payload,
      preferences: user.notificationPreferences,
    };

    await this.notificationQueue.add('process-notification', request, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async processNotification(
    payload: NotificationPayload,
    preferences: NotificationPreferences,
  ): Promise<void> {
    const promises: Promise<boolean>[] = [];

    if (preferences.email) {
      console.log(`Sending email notification to ${payload.data?.user.email}`);
      promises.push(
        this.emailService.send({
          ...payload,
        }),
      );
    }

    if (preferences.sms) {
      console.log(
        `Sending SMS notification to ${payload.data?.user.phoneNumber}`,
      );
      promises.push(this.smsService.send(payload));
    }

    if (preferences.inApp) {
      promises.push(
        this.firebaseService.send({
          ...payload,
        }),
      );
    }

    await Promise.all(promises);
  }
}
