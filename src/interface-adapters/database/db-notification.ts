export class DBNotification {
  public uuid: string;
  public user_uuid: string;
  public channel: string;
  public message_payload: Record<string, unknown>;
  public template: string;
  public subject: string;
  public unique_group_identifiers: unknown;
}
