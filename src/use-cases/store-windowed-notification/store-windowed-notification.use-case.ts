import { UseCaseExecutor } from '../use-case-executor.interface';
import { StoreWindowedNotificationPayload } from './store-windowed-notification-payload';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { UserFetcher } from '../../domain/port-interfaces/user-fetcher.interface';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';
import { UseCase } from '../use-case.decorator';

@injectable()
@UseCase(Types.StoreWindowedNotificationUseCase)
export class StoreWindowedNotificationUseCase
  implements UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>> {
  constructor(
    @inject(Types.NotificationCreator)
    private notificationCreator: NotificationCreator,
    @inject(Types.UserFetcher) private userFetcher: UserFetcher
  ) {}

  async execute(
    storeWindowedNotificationPayload: StoreWindowedNotificationPayload
  ): Promise<void> {
    const {
      channel,
      subject,
      template,
      unmappedData,
      userUUID,
      notificationUUID,
      uniqueGroupIdentifiers,
    } = storeWindowedNotificationPayload;

    const user = await this.userFetcher.getUserByUUID(userUUID);

    const windowedNotification = new Notification(
      notificationUUID,
      user,
      unmappedData,
      channel,
      template,
      subject,
      NotificationStatus.NOTIFICATION_PENDING,
      uniqueGroupIdentifiers
    );

    await this.notificationCreator.storeNewWindowedNotification(
      windowedNotification
    );
  }
}
