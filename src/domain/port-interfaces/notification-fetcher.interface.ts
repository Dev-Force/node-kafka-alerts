import { Notification } from '../models/notification';

export interface NotificationFetcher {
  getAllPendingNotifications(): Promise<Notification[]>;
}
