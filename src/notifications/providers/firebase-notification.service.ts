import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationPayload } from '../../interfaces/notification.interface';

@Injectable()
export class FirebaseNotificationService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      await this.firebaseApp.messaging().send({
        token: payload.data?.user.fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });
      return true;
    } catch (error) {
      console.error('Firebase notification failed:', error);
      return false;
    }
  }
}
