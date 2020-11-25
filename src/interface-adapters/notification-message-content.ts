export type NotificationMessageContent = {
  notificationUUID: string;
  userUUID: string;
  channel: string;
  subject: string;
  template: string;
  unmappedData: Record<string, unknown>;
};
