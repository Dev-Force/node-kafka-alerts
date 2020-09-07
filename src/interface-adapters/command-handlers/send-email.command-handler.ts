import { ICommandHandler } from './command-handler.interface';
import { SendEmailCommand } from '../../domain/commands/send-email-command';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../domain/send-email-payload';

@CommandHandler(SendEmailCommand)
export class SendEmailCommandHandler
  implements ICommandHandler<SendEmailCommand> {
  constructor(
    private usecase: UseCaseExecutor<SendEmailPayload, Promise<boolean>>
  ) {
    this.usecase = usecase;
  }

  handle(cmd: SendEmailCommand): Promise<boolean> {
    console.log('executing usecase');
    return this.usecase.execute(
      new SendEmailPayload(cmd.from, cmd.to, cmd.template, cmd.payload)
    );
  }
}
