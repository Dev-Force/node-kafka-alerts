import { NotificationStatus } from './notification-status';
import { User } from './user';

export class Notification {
  constructor(
    public uuid: string,
    public user: User,
    public unmappedData: Record<string, unknown>,
    public channel: string,
    public template: string,
    public subject: string,
    public status: NotificationStatus = NotificationStatus.PENDING
  ) {
    this.uuid = uuid;
    this.user = user;
    this.unmappedData = unmappedData;
    this.channel = channel;
    this.template = template;
    this.subject = subject;
    this.status = status;
  }
}
