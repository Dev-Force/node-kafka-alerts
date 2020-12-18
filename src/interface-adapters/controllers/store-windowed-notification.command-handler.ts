import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { StoreWindowedNotificationCommand } from '../../domain/commands/store-windowed-notification-command';
import { StoreWindowedNotificationPayload } from '../../use-cases/store-windowed-notification/store-windowed-notification-payload';

@CommandHandler(StoreWindowedNotificationCommand)
export class StoreWindowedNotificationCommandHandler
  implements ICommandHandler<StoreWindowedNotificationCommand> {
  constructor(
    private usecase: UseCaseExecutor<
      StoreWindowedNotificationPayload,
      Promise<void>
    >
  ) {}

  async handle(cmd: StoreWindowedNotificationCommand): Promise<void> {
    this.usecase.execute(
      new StoreWindowedNotificationPayload(
        cmd.notificationMessageContent.notificationUUID,
        cmd.notificationMessageContent.userUUID,
        cmd.notificationMessageContent.subject,
        cmd.notificationMessageContent.template,
        cmd.notificationMessageContent.unmappedData,
        cmd.notificationMessageContent.channel,
        cmd.notificationMessageContent.uniqueGroupIdentifiers
      )
    );
  }
}
