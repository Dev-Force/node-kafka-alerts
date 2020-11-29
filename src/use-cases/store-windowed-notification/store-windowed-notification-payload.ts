export class StoreWindowedNotificationPayload {
  constructor(
    public notificationUUID: string,
    public userUUID: string,
    public subject: string,
    public template: string,
    public unmappedData: Record<string, unknown>,
    public channel: string,
    public uniqueGroupIdentifiers: string[]
  ) {
    this.notificationUUID = notificationUUID;
    this.userUUID = userUUID;
    this.subject = subject;
    this.template = template;
    this.unmappedData = unmappedData;
    this.channel = channel;
    this.uniqueGroupIdentifiers = uniqueGroupIdentifiers;
  }
}
