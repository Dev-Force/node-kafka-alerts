export class NotificationMessageContent {
  public notificationUUID: string;
  public userUUID: string;
  public channel: string;
  public subject: string;
  public template: string;
  public unmappedData: Record<string, unknown>;
  public uniqueGroupIdentifiers: string[];
}
