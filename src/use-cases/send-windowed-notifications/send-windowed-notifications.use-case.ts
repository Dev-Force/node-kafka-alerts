import { UseCaseExecutor } from '../use-case-executor.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { TimeWindowCreator } from '../../domain/port-interfaces/time-window-creator.interface';
import { NotificationFetcher } from '../../domain/port-interfaces/notification-fetcher.interface';
import { NotificationMutator } from '../../domain/port-interfaces/notification-mutator.interface';
import { inject, injectable } from 'inversify';
import { Logger } from '../../domain/port-interfaces/logger.interface';
import { Types } from '../../types';

@injectable()
export class SendWindowedNotificationsUseCase
  implements UseCaseExecutor<void, Promise<void>> {
  constructor(
    @inject(Types.TimeWindowCreator)
    private timeWindowCreator: TimeWindowCreator,
    @inject(Types.NotificationFetcher)
    private notificationFetcher: NotificationFetcher,
    @inject(Types.NotificationMutator)
    private notificationMutator: NotificationMutator,
    @inject(Types.CommandDispatcher)
    private commandDispatcher: CommandDispatcher<
      SendInstantNotificationCommand
    >,
    @inject(Types.Logger)
    private logger: Logger
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
      this.logger.info({ message: 'Failed to send all pending notifications' });
    });

    await this.notificationMutator.updateNotificationsToSent(
      pendingNotifications.map((pn) => pn.uuid)
    );

    return;
  }
}
