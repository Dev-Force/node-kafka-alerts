import { UseCaseExecutor } from '../use-case-executor.interface';
import { StoreWindowedNotificationPayload } from './store-windowed-notification-payload';
import { NotificationGateway } from '../../domain/port-interfaces/notification-gateway.interface';
import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';

export class SendEmailUseCase
  implements UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>> {
  constructor(private notificationGateway: NotificationGateway) {
    this.notificationGateway = notificationGateway;
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

    await this.notificationGateway.storeNewWindowedNotification(
      windowedNotification
    );
  }
}
