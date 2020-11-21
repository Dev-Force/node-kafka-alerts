import { ICommand } from './command.interface';
import { NotificationMessage } from './notification-message';

export interface MessageTransformer {
  bufferMessageToNotificationMessage(payload: Buffer): NotificationMessage;
  createCommandFromNotificationMessage(
    notificationMessage: NotificationMessage
  ): ICommand;
}
