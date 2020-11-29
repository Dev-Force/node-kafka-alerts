import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';
import { DBNotification } from './db-notification';
import { UserRow } from './user-row';

export interface DatabaseAccessor {
  buildUser(userRow: UserRow): User;
  notificationFromDomainNotification(
    notification: Notification
  ): DBNotification;
}
