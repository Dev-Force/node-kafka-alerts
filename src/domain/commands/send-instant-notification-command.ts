import { CommandMarker } from './command-marker.interface';
import { NotificationMessageContentBaseCommand } from './notification-message-content-base-command';

export class SendInstantNotificationCommand
  extends NotificationMessageContentBaseCommand
  implements CommandMarker {}
