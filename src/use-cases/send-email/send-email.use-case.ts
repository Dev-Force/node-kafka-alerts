import { UseCaseExecutor } from '../use-case-executor.interface';
import { TemplateCompiler } from '../../domain/port-interfaces/template-compiler.interface';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';
import { FileReader } from '../../domain/port-interfaces/file-reader.interface';
import { SendEmailPayload } from './send-email-payload';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';
import { NotificationStatus } from '../../domain/models/notification-status';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';
import { UseCase } from '../use-case.decorator';

@injectable()
@UseCase(Types.SendEmailUseCase)
export class SendEmailUseCase
  implements UseCaseExecutor<SendEmailPayload, Promise<void>> {
  constructor(
    @inject(Types.NotificationCreator)
    private notificationCreator: NotificationCreator,
    @inject(Types.TemplateCompiler) private templateCompiler: TemplateCompiler,
    @inject(Types.EmailSender) private emailSender: EmailSender,
    @inject(Types.FileReader) private fileReader: FileReader
  ) {}

  async execute(sendEmailPayload: SendEmailPayload): Promise<void> {
    const {
      from,
      to,
      subject,
      isHTML,
      templatePath,
      payload,
      channel,
      notificationUUID,
      template,
      userUUID,
    } = sendEmailPayload;

    const templateFile = await this.fileReader.readFile(templatePath, {
      encoding: 'utf-8',
    });

    const compiledPayload = this.templateCompiler.compile(
      templateFile,
      payload
    );

    await this.emailSender.sendEmail(
      from,
      to,
      subject,
      isHTML,
      compiledPayload
    );

    await this.notificationCreator.storeNewNotification(
      new Notification(
        notificationUUID,
        new User(userUUID, to, ''),
        payload,
        channel,
        template,
        subject,
        NotificationStatus.NOTIFICATION_SENT,
        []
      )
    );
  }
}
