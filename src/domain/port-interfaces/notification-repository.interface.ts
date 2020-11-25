import { Notification } from '../models/notification';

export interface NotificationRepository {
  storeNewWindowedNotification(notification: Notification): Promise<void>;
}
