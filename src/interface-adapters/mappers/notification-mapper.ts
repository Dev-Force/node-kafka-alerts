import { injectable } from 'inversify';
import { Notification } from '../../domain/models/notification';
import { NotificationRow } from '../gateways/notification-row';
import { DALMapper } from './dal-mapper.interface';

@injectable()
export class NotificationMapper
  implements DALMapper<Notification, NotificationRow> {
  public fromDALEntityToDomain(notificationRow: NotificationRow): Notification {
    throw new Error('Method not implemented.');
  }

  public fromDomainToDALEntity(notification: Notification): NotificationRow {
    const notificationRow = new NotificationRow();
    notificationRow.channel = notification.channel;
    notificationRow.message_payload = notification.unmappedData;
    notificationRow.subject = notification.subject;
    notificationRow.template = notification.template;
    notificationRow.status = notification.status;
    notificationRow.user_uuid = notification.user.uuid;
    notificationRow.uuid = notification.uuid;
    notificationRow.unique_group_identifiers = notification.uniqueGroupIdentifiers.reduce<
      Record<string, unknown>
    >((acc, ugi) => ({ ...acc, [ugi]: notification.unmappedData[ugi] }), {});

    return notificationRow;
  }
}
