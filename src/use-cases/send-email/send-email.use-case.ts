import { UseCaseExecutor } from '../use-case-executor.interface';
import { Compiler } from '../../domain/port-interfaces/compiler.interface';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';
import { FileReader } from '../../domain/port-interfaces/file-reader.interface';
import { SendEmailPayload } from './send-email-payload';
import { NotificationCreator } from '../../domain/port-interfaces/notification-creator.interface';
import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';
import { NotificationStatus } from '../../domain/models/notification-status';

export class SendEmailUseCase
  implements UseCaseExecutor<SendEmailPayload, Promise<void>> {
  constructor(
    private notificationCreator: NotificationCreator,
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

    this.emailSender.sendEmail(from, to, subject, isHTML, compiledPayload);

    this.notificationCreator.storeNewNotification(
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
