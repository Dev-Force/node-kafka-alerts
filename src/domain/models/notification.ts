import { NotificationStatus } from './notification-status';
import { User } from './user';

export const NotificationAggregateType = 'NOTIFICATION';

export class Notification {
  constructor(
    public uuid: string,
    public user: User,
    public unmappedData: Record<string, unknown>,
    public channel: string,
    public template: string,
    public subject: string,
    public status: NotificationStatus = NotificationStatus.NOTIFICATION_PENDING,
    public uniqueGroupIdentifiers: string[]
  ) {}
}
