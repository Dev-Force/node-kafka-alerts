import { NotificationRow } from './notification-row';

export interface NotificationDAO {
  storeNewWindowedNotification(notification: NotificationRow): Promise<void>;
  getAllPendingNotifications(): Promise<NotificationRow[]>;
}
