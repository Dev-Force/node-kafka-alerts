import { ICommandHandler } from './command-handler.interface';
import { SendEmailCommand } from '../../domain/commands/send-email-command';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../domain/send-email-payload';

@CommandHandler(SendEmailCommand)
export class SendEmailCommandHandler
  implements ICommandHandler<SendEmailCommand> {
  constructor(
    private usecase: UseCaseExecutor<SendEmailPayload, Promise<boolean>>,
    private fsAsync: any,
    private templatePath: string
  ) {
    this.usecase = usecase;
    this.fsAsync = fsAsync;
    this.templatePath = templatePath;
  }

  async handle(cmd: SendEmailCommand): Promise<boolean> {
    const { from, to, subject, isHTML, template, payload } = cmd;

    const fileTemplate = await this.fsAsync.readFile(
      `${this.templatePath}/${template}`,
      {
        encoding: 'utf-8',
      }
    );

    console.log('executing usecase');

    return this.usecase.execute(
      new SendEmailPayload(from, to, subject, isHTML, fileTemplate, payload)
    );
  }
}
