export class NotificationMessage {
  public subject: string;
  public channel: string;
  public recipient: string;
  public template: string;
  public isHTML: boolean;
  public unmappedData: Record<string, unknown>;
}
