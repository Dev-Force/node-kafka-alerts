import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendWindowedNotificationsCommand } from '../../domain/commands/send-windowed-notifications-command';

@CommandHandler(SendWindowedNotificationsCommand)
export class SendWindowedNotificationsCommandHandler
  implements ICommandHandler<SendWindowedNotificationsCommand> {
  constructor(
    private sendWindowedNotificationsUsecase: UseCaseExecutor<
      void,
      Promise<void>
    >
  ) {
    this.sendWindowedNotificationsUsecase = sendWindowedNotificationsUsecase;
  }

  async handle(): Promise<void> {
    this.sendWindowedNotificationsUsecase.execute();
  }
}