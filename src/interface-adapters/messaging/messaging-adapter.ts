import { SendInstantEmailCommand } from '../../domain/send-instant-email-command';
import { ICommand } from '../../domain/command.interface';
import { MessageTransformer } from '../../domain/message-transformer.interface';
import { NotificationMessage } from '../../domain/notification-message';

export class MessagingAdapter implements MessageTransformer {
  public bufferMessageToNotificationMessage(
    payload: Buffer
  ): NotificationMessage {
    return <NotificationMessage>JSON.parse(payload.toString('utf8'));
  }

  public createCommandFromNotificationMessage({
    channel,
    recipient,
    subject,
    isHTML,
    template,
    unmappedData,
  }: NotificationMessage): ICommand {
    // Maybe a command factory is required here.
    if (channel === 'EMAIL') {
      return new SendInstantEmailCommand(
        'noreply@devforce.gr',
        recipient,
        subject,
        isHTML,
        template,
        unmappedData
      );
    }
  }
}
