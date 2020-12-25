import { UseCaseExecutor } from '../use-case-executor.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { TimeWindowCreator } from '../../domain/port-interfaces/time-window-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';
import { NotificationMutator } from '../../domain/port-interfaces/notification-mutator.interface';

export class SendWindowedNotificationsUseCase
  implements UseCaseExecutor<void, Promise<void>> {
  constructor(
    private timeWindowCreator: TimeWindowCreator,
    private notificationFetcher: NotificationFetcher,
    private notificationMutator: NotificationMutator,
    private commandDispatcher: CommandDispatcher<SendInstantNotificationCommand>
  ) {}

  public async execute(): Promise<void> {
    // const window = await this.timeWindowFetcher.getLatestTimeWindow();
    await this.timeWindowCreator.createNewTimeWindow();

    const pendingNotifications = await this.notificationFetcher.getAllPendingNotifications();

    // TODO: DONT DISCARD NON EMAIL NOTIFICATIONS
    const pendingNotificationPromiseArray = pendingNotifications
      .filter((n) => n.channel === 'EMAIL')
      .map((n) =>
        this.commandDispatcher.dispatch(
          new SendInstantNotificationCommand({
            notificationUUID: n.uuid,
            channel: n.channel,
            subject: n.subject,
            template: n.template,
            uniqueGroupIdentifiers: n.uniqueGroupIdentifiers,
            unmappedData: n.unmappedData,
            userUUID: n.user.uuid,
          } as NotificationMessageContent)
        )
      );

    await Promise.all(pendingNotificationPromiseArray).catch(() => {
      console.log('Failed to send all pending notifications');
    });

    await this.notificationMutator.updateNotificationsToSent(
      pendingNotifications.map((pn) => pn.uuid)
    );

    return;
  }
}
