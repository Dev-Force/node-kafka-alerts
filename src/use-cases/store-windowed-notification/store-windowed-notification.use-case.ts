import { UseCaseExecutor } from '../use-case-executor.interface';
import { StoreWindowedNotificationPayload } from './store-windowed-notification-payload';
import { NotificationRepository } from '../../domain/port-interfaces/notification-repository.interface';
import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';

export class SendEmailUseCase
  implements UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>> {
  constructor(private notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
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
    } = storeWindowedNotificationPayload;

    const user = new User(userUUID, null, null);
    const windowedNotification = new Notification(
      null,
      user,
      unmappedData,
      channel,
      template,
      subject
    );

    await this.notificationRepository.storeNewWindowedNotification(
      windowedNotification
    );
  }
}
