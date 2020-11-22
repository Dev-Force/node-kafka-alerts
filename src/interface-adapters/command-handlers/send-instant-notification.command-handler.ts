import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../use-cases/send-email/send-email-payload';
import { SendInstantNotificationCommand } from '../commands/send-instant-notification-command';
import { User } from '../../domain/models/user';

@CommandHandler(SendInstantNotificationCommand)
export class SendInstantNotificationCommandHandler
  implements ICommandHandler<SendInstantNotificationCommand> {
  constructor(
    private sendEmailUsecase: UseCaseExecutor<SendEmailPayload, Promise<void>>,
    private templateDirPath: string,
    private templateExtension: string
  ) {
    this.sendEmailUsecase = sendEmailUsecase;
    this.templateDirPath = templateDirPath;
    this.templateExtension = templateExtension;
  }

  async handle(cmd: SendInstantNotificationCommand): Promise<void> {
    const {
      channel,
      // status,
      subject,
      template,
      unmappedData,
      // user,
      // uuid,
    } = cmd.notificationMessageContent;
    const templatePath = `${this.templateDirPath}/${template}.${this.templateExtension}`;

    // TODO: get user details from user repository first by uuid
    const usr = new User('uuid', 'email', 'phone');

    // TODO: check from config if template contains HTML
    const isHTML = true;

    if (channel === 'EMAIL') {
      // TODO: get from email from config
      const fromEmail = 'no-reply@devforce.gr';

      this.sendEmailUsecase.execute(
        new SendEmailPayload(
          fromEmail,
          usr.email,
          subject,
          isHTML,
          templatePath,
          unmappedData
        )
      );
    }
    // if (channel === 'SMS') {
    //   this.sendSMSUsecase.execute(
    //     new SendSMSPayload(from, to, subject, templatePath, payload)
    //   );
    // }
  }
}
