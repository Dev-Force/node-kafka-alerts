import { GroupedNotificationRow } from './grouped-notification-row';
import { NotificationRow } from './notification-row';

export interface NotificationDAO {
  storeNewWindowedNotification(notification: NotificationRow): Promise<void>;
  getAllPendingNotifications(): Promise<GroupedNotificationRow[]>;
  updateNotificationsToSent(notificationUUIDs: string[]): Promise<void>;
}
