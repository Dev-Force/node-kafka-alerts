import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../use-cases/send-email/send-email-payload';
import { SendInstantNotificationCommand } from '../commands/send-instant-notification-command';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';

@CommandHandler(SendInstantNotificationCommand)
export class SendInstantNotificationCommandHandler
  implements ICommandHandler<SendInstantNotificationCommand> {
  constructor(
    private sendEmailUsecase: UseCaseExecutor<SendEmailPayload, Promise<void>>,
    private userRepo: UserRepository,
    private templateDirPath: string,
    private templateExtension: string,
    private fromEmail: string
  ) {
    this.sendEmailUsecase = sendEmailUsecase;
    this.templateDirPath = templateDirPath;
    this.templateExtension = templateExtension;
    this.fromEmail = fromEmail;
  }

  async handle(cmd: SendInstantNotificationCommand): Promise<void> {
    const {
      channel,
      // status,
      subject,
      template,
      unmappedData,
      // user,
      userUUID,
    } = cmd.notificationMessageContent;
    const templatePath = `${this.templateDirPath}/${template}.${this.templateExtension}`;

    const usr = await this.userRepo.getUserByUUID(userUUID);

    // TODO: check from config if template contains HTML
    const isHTML = true;

    if (channel === 'EMAIL') {
      const { fromEmail } = this;
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
