import { UseCaseExecutor } from '../use-case-executor.interface';
import { StoreWindowedNotificationPayload } from './store-windowed-notification-payload';
import { NotificationRepository } from '../../domain/port-interfaces/notification-repository.interface';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';

export class StoreWindowedNotificationsUseCase
  implements UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>> {
  constructor(
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository
  ) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

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

    const user = await this.userRepository.getUserByUUID(userUUID);

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

    await this.notificationRepository.storeNewWindowedNotification(
      windowedNotification
    );
  }
}
