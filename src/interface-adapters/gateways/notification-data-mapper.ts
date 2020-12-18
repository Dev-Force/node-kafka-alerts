import { ConfigTemplate } from '../../domain/models/config-template';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';
import { NotificationMutator } from '../../domain/port-interfaces/notification-mutator.interface';
import { GroupedNotificationRow } from './grouped-notification-row';
import { NotificationDAO } from './notification-dao.interface';
import { NotificationRow } from './notification-row';

export class NotificationDataMapper
  implements NotificationFetcher, NotificationCreator, NotificationMutator {
  constructor(
    private notificationDAO: NotificationDAO,
    private templates: ConfigTemplate[]
  ) {}

  public async storeNewNotification(notification: Notification): Promise<void> {
    await this.notificationDAO.storeNewNotification(
      this.toNotificationRow(notification)
    );
  }

  public async updateNotificationsToSent(
    notificationUUIDs: string[]
  ): Promise<void> {
    await this.notificationDAO.updateNotificationsToSent(notificationUUIDs);
  }

  public async storeNewWindowedNotification(
    notification: Notification
  ): Promise<void> {
    await this.notificationDAO.storeNewWindowedNotification(
      this.toNotificationRow(notification)
    );
  }

  public async getAllPendingNotifications(): Promise<Notification[]> {
    const groupedNotificationRows: GroupedNotificationRow[] = await this.notificationDAO.getAllPendingNotifications();

    return groupedNotificationRows
      .map((gn) => this.groupedNotificationRowToDomainNotifications(gn))
      .reduce((acc, notifications) => {
        return [...acc, ...notifications];
      }, []);
  }

  private groupedNotificationRowToDomainNotifications({
    notification_uuids,
    user_uuid,
    template,
    message_payloads,
    channel,
  }: GroupedNotificationRow): Notification[] {
    return notification_uuids.map(
      (notificationUUID, idx) =>
        new Notification(
          notificationUUID,
          new User(user_uuid, null, null),
          message_payloads[idx],
          channel,
          template,
          this.getTemplateSubject(template),
          NotificationStatus.NOTIFICATION_PENDING,
          []
        )
    );
  }

  private getTemplateSubject(template: string) {
    const templateConfigEntry = this.templates.find((t) => t.name === template);
    return templateConfigEntry.subject || '';
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
