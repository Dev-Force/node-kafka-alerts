export type NotificationMessageContent = {
  notificationUUID: string;
  userUUID: string;
  channel: string;
  recipient: string;
  subject: string;
  isHTML?: boolean;
  template: string;
  unmappedData: Record<string, unknown>;
};
