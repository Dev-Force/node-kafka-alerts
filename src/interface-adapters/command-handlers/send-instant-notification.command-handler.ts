import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../use-cases/send-email/send-email-payload';
import { SendInstantNotificationCommand } from '../commands/send-instant-notification-command';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';
import { ConfigTemplate } from '../../domain/models/config-template';

@CommandHandler(SendInstantNotificationCommand)
export class SendInstantNotificationCommandHandler
  implements ICommandHandler<SendInstantNotificationCommand> {
  constructor(
    private sendEmailUsecase: UseCaseExecutor<SendEmailPayload, Promise<void>>,
    private userRepo: UserRepository,
    private templateDirPath: string,
    private templateExtension: string,
    private fromEmail: string,
    private configTemplates: ConfigTemplate[]
  ) {
    this.sendEmailUsecase = sendEmailUsecase;
    this.userRepo = userRepo;
    this.templateDirPath = templateDirPath;
    this.templateExtension = templateExtension;
    this.fromEmail = fromEmail;
    this.configTemplates = configTemplates;
  }

  async handle(cmd: SendInstantNotificationCommand): Promise<void> {
    const {
      channel,
      subject,
      template,
      unmappedData,
      userUUID,
    } = cmd.notificationMessageContent;
    const templatePath = `${this.templateDirPath}/${template}.${this.templateExtension}`;

    const usr = await this.userRepo.getUserByUUID(userUUID);

    const templateConfigEntry = this.configTemplates.find(
      (t) => t.name === template
    );
    const isHTML = templateConfigEntry.containsHTML ? true : false;

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
