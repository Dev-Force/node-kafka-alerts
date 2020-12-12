export interface NotificationMutator {
  updateNotificationsToSent(notificationUUIDs: string[]): Promise<void>;
}
