import { Notification } from '../models/notification';

export interface NotificationGateway {
  storeNewWindowedNotification(notification: Notification): Promise<void>;
}
