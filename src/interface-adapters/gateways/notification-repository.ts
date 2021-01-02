import { inject, injectable } from 'inversify';
import { Notification } from '../../domain/models/notification';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';
import { NotificationMutator } from '../../domain/port-interfaces/notification-mutator.interface';
import { Types } from '../../types';
import { DALMapper } from '../mappers/dal-mapper.interface';
import { NotificationMapper } from '../mappers/notification-mapper';
import { GroupedNotificationRow } from './grouped-notification-row';
import { NotificationDAO } from './notification-dao.interface';

@injectable()
export class NotificationRepository
  implements NotificationFetcher, NotificationCreator, NotificationMutator {
  constructor(
    @inject(Types.NotificationDAO) private notificationDAO: NotificationDAO,
    @inject(Types.DALNotificationMapper)
    private notificationMapper: NotificationMapper,
    @inject(Types.DALGroupedNotificationMapper)
    private groupedNotificationMapper: DALMapper<
      Notification[],
      GroupedNotificationRow
    >
  ) {}

  public async storeNewNotification(notification: Notification): Promise<void> {
    await this.notificationDAO.storeNewNotification(
      this.notificationMapper.fromDomainToDALEntity(notification)
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
      this.notificationMapper.fromDomainToDALEntity(notification)
    );
  }

  public async getAllPendingNotifications(): Promise<Notification[]> {
    const groupedNotificationRows: GroupedNotificationRow[] = await this.notificationDAO.getAllPendingNotifications();

    return groupedNotificationRows
      .map((gn) => this.groupedNotificationMapper.fromDALEntityToDomain(gn))
      .reduce((acc, notifications) => {
        return [...acc, ...notifications];
      }, []);
  }
}
