import { UseCaseExecutor } from '../use-case-executor.interface';
import { Compiler } from '../../domain/port-interfaces/compiler.interface';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';
import { FileReader } from '../../domain/port-interfaces/file-reader.interface';
import { SendEmailPayload } from './send-email-payload';

export class SendEmailUseCase
  implements UseCaseExecutor<SendEmailPayload, Promise<void>> {
  constructor(
    private templateCompiler: Compiler,
    private emailSender: EmailSender,
    private fileReader: FileReader
  ) {
    this.templateCompiler = templateCompiler;
    this.emailSender = emailSender;
    this.fileReader = fileReader;
  }

  async execute(sendEmailPayload: SendEmailPayload): Promise<void> {
    const {
      from,
      to,
      subject,
      isHTML,
      templatePath,
      payload,
    } = sendEmailPayload;

    const template = await this.fileReader.readFile(templatePath, {
      encoding: 'utf-8',
    });

    // console.log('compiling and sending email');
    const compiledPayload = this.templateCompiler.compile(template, payload);

    this.emailSender.sendEmail(from, to, subject, isHTML, compiledPayload);

    // TODO: maybe insert Notification sent here.
  }
}
