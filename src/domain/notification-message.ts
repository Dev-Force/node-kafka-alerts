export class NotificationMessage {
  public eventId: string;
  public subject: string;
  public channel: string;
  public recipient: string;
  public eventType: string;
  public description: string;
  public machineId: string;
  public userId: string;
  public unmappedData: Record<string, unknown>;
}
