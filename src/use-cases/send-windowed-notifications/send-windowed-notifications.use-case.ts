import { UseCaseExecutor } from '../use-case-executor.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { TimeWindowCreator } from '../../domain/port-interfaces/time-window-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';

export class SendWindowedNotificationsUseCase
  implements UseCaseExecutor<void, Promise<void>> {
  constructor(
    private timeWindowCreator: TimeWindowCreator,
    private notificationFetcher: NotificationFetcher,
    private commandDispatcher: CommandDispatcher<SendInstantNotificationCommand>
  ) {}

  public async execute(): Promise<void> {
    // const window = await this.timeWindowFetcher.getLatestTimeWindow();
    await this.timeWindowCreator.createNewTimeWindow();

    const pendingNotifications = await this.notificationFetcher.getAllPendingNotifications();

    // TODO: DONT DISCARD NON EMAIL NOTIFICATIONS
    const pendingBatchNotifications = pendingNotifications.filter(
      (n) => n.channel === 'EMAIL'
    );

    const promiseArray = pendingBatchNotifications.reduce((acc, row) => {
      const toAppend = row.notification_uuids.map((notificationUUID, idx) => {
        const notificationContent = new NotificationMessageContent();
        notificationContent.channel = row.channel;
        notificationContent.notificationUUID = notificationUUID;
        notificationContent.subject = 'test';
        notificationContent.template = row.template;

        notificationContent.unmappedData = row.message_payloads[idx];
        notificationContent.userUUID = row.user_uuid;

        return this.commandDispatcher.dispatch(
          new SendInstantNotificationCommand(notificationContent)
        );
      });

      return [...acc, ...toAppend];
    }, []);

    await Promise.all(promiseArray).catch(() => {
      console.log('FAILED TO SEND ALL PENDING NOTIFICATIONS');
    });

    // TODO: update send notifications to SENT status

    return;
  }
}
