import { Notification } from '../models/notification';

export interface NotificationCreator {
  storeNewWindowedNotification(notification: Notification): Promise<void>;
  storeNewNotification(notification: Notification): Promise<void>;
}
