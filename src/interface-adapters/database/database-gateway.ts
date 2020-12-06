import { Notification } from '../../domain/models/notification';
import { User } from '../../domain/models/user';
import { DatabaseAccessor } from './database-accessor.interface';
import { DBNotification } from './db-notification';
import { UserRow } from './user-row';

export class DatabaseGateway implements DatabaseAccessor {
  public buildUser(userRow: UserRow): User {
    const { uuid, email, phone } = userRow;
    return new User(uuid, email, phone);
  }

  public notificationFromDomainNotification(
    notification: Notification
  ): DBNotification {
    const dbNotification = new DBNotification();
    dbNotification.channel = notification.channel;
    dbNotification.message_payload = notification.unmappedData;
    dbNotification.subject = notification.subject;
    dbNotification.template = notification.template;
    dbNotification.user_uuid = notification.user.uuid;
    dbNotification.uuid = notification.uuid;
    dbNotification.unique_group_identifiers = notification.uniqueGroupIdentifiers.reduce<
      Record<string, unknown>
    >((acc, ugi) => ({ ...acc, [ugi]: notification.unmappedData[ugi] }), {});

    return dbNotification;
  }
}
