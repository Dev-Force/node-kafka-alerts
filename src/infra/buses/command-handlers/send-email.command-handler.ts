import { ICommandHandler } from '../../../domain/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../../domain/send-email-payload';
import { SendInstantEmailCommand } from '../../../domain/send-instant-email-command';
import { FileReader } from '../../../domain/file-reader.interface';

@CommandHandler(SendInstantEmailCommand)
export class SendInstantEmailCommandHandler
  implements ICommandHandler<SendInstantEmailCommand> {
  constructor(
    private usecase: UseCaseExecutor<SendEmailPayload, Promise<boolean>>,
    private fileReader: FileReader,
    private templatePath: string
  ) {
    this.usecase = usecase;
    this.fileReader = fileReader;
    this.templatePath = templatePath;
  }

  async handle(cmd: SendInstantEmailCommand): Promise<boolean> {
    const { from, to, subject, isHTML, template, payload } = cmd;

    const fileTemplate = await this.fileReader.readFile(
      `${this.templatePath}/${template}`,
      {
        encoding: 'utf-8',
      }
    );

    // console.log('executing usecase');

    return this.usecase.execute(
      new SendEmailPayload(from, to, subject, isHTML, fileTemplate, payload)
    );
  }
}
