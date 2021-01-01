import { inject, injectable } from 'inversify';
import { ConfigTemplate } from '../../domain/models/config-template';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { GroupedNotificationRow } from '../gateways/grouped-notification-row';
import { DALMapper } from './dal-mapper.interface';

@injectable()
export class GroupedNotificationMapper
  implements DALMapper<Notification[], GroupedNotificationRow> {
  constructor(@inject('ConfigTemplates') private templates: ConfigTemplate[]) {}

  public fromDALEntityToDomain({
    notification_uuids,
    user_uuid,
    template,
    message_payloads,
    channel,
  }: GroupedNotificationRow): Notification[] {
    return notification_uuids.map(
      (notificationUUID, idx) =>
        new Notification(
          notificationUUID,
          new User(user_uuid, null, null),
          message_payloads[idx],
          channel,
          template,
          this.getTemplateSubject(template),
          NotificationStatus.NOTIFICATION_PENDING,
          []
        )
    );
  }

  public fromDomainToDALEntity(
    notifications: Notification[]
  ): GroupedNotificationRow {
    throw new Error('Method not implemented.');
  }

  private getTemplateSubject(template: string) {
    const templateConfigEntry = this.templates.find((t) => t.name === template);
    return templateConfigEntry.subject || '';
  }
}
