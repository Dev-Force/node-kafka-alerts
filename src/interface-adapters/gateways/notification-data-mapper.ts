import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';
import { NotificationDAO } from './notification-dao.interface';
import { NotificationRow } from './notification-row';

export class NotificationDataMapper
  implements NotificationFetcher, NotificationCreator {
  constructor(private notificationDAO: NotificationDAO) {
    this.notificationDAO = notificationDAO;
  }

  public async storeNewWindowedNotification(
    notification: Notification
  ): Promise<void> {
    await this.notificationDAO.storeNewWindowedNotification(
      this.toNotificationRow(notification)
    );
  }

  public async getAllPendingNotifications(): Promise<Notification[]> {
    const notificationRows = await this.notificationDAO.getAllPendingNotifications();
    return notificationRows.map((n) => this.toDomainNotification(n));
  }

  private toDomainNotification(notificationRow: NotificationRow): Notification {
    const {
      uuid,
      message_payload,
      channel,
      template,
      subject,
      // status,
      unique_group_identifiers,
      user_uuid,
    } = notificationRow;

    const user = new User(user_uuid, null, null);
    return new Notification(
      uuid,
      user,
      message_payload,
      channel,
      template,
      subject,
      NotificationStatus.NOTIFICATION_PENDING, // TODO: fix status pending to status from db
      Object.keys(unique_group_identifiers)
    );
  }

  private toNotificationRow(notification: Notification): NotificationRow {
    const notificationRow = new NotificationRow();
    notificationRow.channel = notification.channel;
    notificationRow.message_payload = notification.unmappedData;
    notificationRow.subject = notification.subject;
    notificationRow.template = notification.template;
    notificationRow.user_uuid = notification.user.uuid;
    notificationRow.uuid = notification.uuid;
    notificationRow.unique_group_identifiers = notification.uniqueGroupIdentifiers.reduce<
      Record<string, unknown>
    >((acc, ugi) => ({ ...acc, [ugi]: notification.unmappedData[ugi] }), {});

    return notificationRow;
  }
}
