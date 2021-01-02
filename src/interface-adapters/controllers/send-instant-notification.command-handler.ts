import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SendEmailPayload } from '../../use-cases/send-email/send-email-payload';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { ConfigTemplate } from '../../domain/models/config-template';
import { UserFetcher } from '../../domain/port-interfaces/user-fetcher.interface';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';

@injectable()
@CommandHandler(SendInstantNotificationCommand)
export class SendInstantNotificationCommandHandler
  implements ICommandHandler<SendInstantNotificationCommand> {
  constructor(
    @inject(Types.SendEmailUseCase)
    private sendEmailUsecase: UseCaseExecutor<SendEmailPayload, Promise<void>>,
    @inject(Types.UserFetcher) private userFetcher: UserFetcher,
    @inject(Types.TemplateDirPath) private templateDirPath: string,
    @inject(Types.TemplateExtension) private templateExtension: string,
    @inject(Types.FromEmail) private fromEmail: string,
    @inject(Types.ConfigTemplates) private configTemplates: ConfigTemplate[]
  ) {}

  async handle(cmd: SendInstantNotificationCommand): Promise<void> {
    const {
      channel,
      subject,
      template,
      unmappedData,
      userUUID,
      notificationUUID,
    } = cmd.notificationMessageContent;
    const templatePath = `${this.templateDirPath}/${template}.${this.templateExtension}`;

    const usr = await this.userFetcher.getUserByUUID(userUUID);

    const templateConfigEntry = this.configTemplates.find(
      (t) => t.name === template
    );
    const isHTML = templateConfigEntry.containsHTML ? true : false;

    if (channel === 'EMAIL') {
      const { fromEmail } = this;
      await this.sendEmailUsecase.execute(
        new SendEmailPayload(
          fromEmail,
          usr.email,
          subject,
          isHTML,
          templatePath,
          unmappedData,
          notificationUUID,
          userUUID,
          template,
          channel
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
