import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { StoreWindowedNotificationCommand } from '../commands/store-windowed-notification-command';
import { StoreWindowedNotificationPayload } from '../../use-cases/store-windowed-notification/store-windowed-notification-payload';

@CommandHandler(StoreWindowedNotificationCommand)
export class StoreWindowedNotificationCommandHandler
  implements ICommandHandler<StoreWindowedNotificationCommand> {
  constructor(
    private usecase: UseCaseExecutor<
      StoreWindowedNotificationPayload,
      Promise<void>
    >
  ) {
    this.usecase = usecase;
  }

  async handle(cmd: StoreWindowedNotificationCommand): Promise<void> {
    const {
      notificationMessageContent: {
        notificationUUID,
        userUUID,
        template,
        subject,
        unmappedData,
        channel,
      },
    } = cmd;

    this.usecase.execute(
      new StoreWindowedNotificationPayload(
        notificationUUID,
        userUUID,
        subject,
        template,
        unmappedData,
        channel
      )
    );
  }
}
