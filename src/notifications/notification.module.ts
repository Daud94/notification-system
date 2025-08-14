import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './providers/email-notification.service';
import { SmsNotificationService } from './providers/sms-notification.service';
import { FirebaseNotificationService } from './providers/firebase-notification.service';
import { NotificationProcessor } from './notification.processor';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [
    NotificationService,
    EmailNotificationService,
    SmsNotificationService,
    FirebaseNotificationService,
    NotificationProcessor,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
