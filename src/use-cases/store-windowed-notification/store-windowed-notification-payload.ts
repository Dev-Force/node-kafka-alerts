export class StoreWindowedNotificationPayload {
  constructor(
    public userUUID: string,
    public subject: string,
    public template: string,
    public unmappedData: Record<string, unknown>,
    public channel: string
  ) {
    this.userUUID = userUUID;
    this.subject = subject;
    this.template = template;
    this.unmappedData = unmappedData;
    this.channel = channel;
  }
}
