import { CommandHandler } from './command-handler.interface';
import { CommandHandlerFor } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendWindowedNotificationsCommand } from '../../domain/commands/send-windowed-notifications-command';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';

@injectable()
@CommandHandlerFor(SendWindowedNotificationsCommand)
export class SendWindowedNotificationsCommandHandler
  implements CommandHandler<SendWindowedNotificationsCommand> {
  constructor(
    @inject(Types.SendWindowedNotificationsUseCase)
    private sendWindowedNotificationsUsecase: UseCaseExecutor<
      void,
      Promise<void>
    >
  ) {}

  async handle(): Promise<void> {
    await this.sendWindowedNotificationsUsecase.execute();
  }
}
