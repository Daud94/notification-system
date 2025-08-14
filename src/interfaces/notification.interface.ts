export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface NotificationRequest {
  payload: NotificationPayload;
  preferences: NotificationPreferences;
}
