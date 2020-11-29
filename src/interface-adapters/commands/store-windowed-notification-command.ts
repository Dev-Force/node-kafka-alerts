import { CommandMarker } from './command-marker.interface';
import { NotificationMessageContentBaseCommand } from './notification-message-content-base-command';

export class StoreWindowedNotificationCommand
  extends NotificationMessageContentBaseCommand
  implements CommandMarker {}
