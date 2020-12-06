import { NotificationMessageContent } from '../notification-message-content';
import { CommandMarker } from './command-marker.interface';

export class NotificationMessageContentBaseCommand implements CommandMarker {
  constructor(public notificationMessageContent: NotificationMessageContent) {
    this.notificationMessageContent = notificationMessageContent;
  }
}
