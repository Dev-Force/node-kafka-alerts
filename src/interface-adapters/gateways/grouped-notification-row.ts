export class GroupedNotificationRow {
  public user_uuid: string;
  public template: string;
  public channel: string;
  public notification_uuids: string[];
  public message_payloads: Record<string, unknown>[];
}
