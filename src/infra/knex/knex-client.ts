import * as knex from 'knex';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { NotificationRepository } from '../../domain/port-interfaces/notification-repository.interface';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';
import { DatabaseAccessor } from '../../interface-adapters/database/database-accessor.interface';
import { NotificationRow } from '../../interface-adapters/database/notification-row';
import { UserRow } from '../../interface-adapters/database/user-row';

export class KnexClient implements NotificationRepository, UserRepository {
  private knexConn: knex;
  private userAdapter: DatabaseAccessor;
  private notificationAdapter: DatabaseAccessor;

  constructor(
    connStr: string,
    userAdapter: DatabaseAccessor,
    notificationAdapter: DatabaseAccessor
  ) {
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: ['notification-service'],
    });
    this.userAdapter = userAdapter;
    this.notificationAdapter = notificationAdapter;
  }

  public async getUserByUUID(uuid: string): Promise<User> {
    const { email, phone } = await this.knexConn
      .select('email', 'phone')
      .from<{ email: string; phone: string }[]>('users')
      .where('uuid', uuid)
      .first();

    return this.userAdapter.buildUser({ uuid, email, phone });
  }

  public async storeNewWindowedNotification(
    notification: Notification
  ): Promise<void> {
    const dbNotification = this.notificationAdapter.notificationFromDomainNotification(
      notification
    );

    await this.knexConn.transaction(async (trx) => {
      const {
        uuid,
        user_uuid,
        channel,
        message_payload,
        template,
        subject,
        unique_group_identifiers,
      } = dbNotification;

      const lastNotificationVersion = await this.knexConn('events')
        .transacting(trx)
        .select('version')
        .where('aggregate_uuid', uuid)
        .orderBy('id', 'desc')
        .first();
      const newNotificationVersion =
        lastNotificationVersion != null
          ? lastNotificationVersion.version + 1
          : 1;

      const timeWindowUUID = await this.knexConn('time_windows')
        .transacting(trx)
        .select('uuid')
        .orderBy('id', 'desc')
        .first();

      // // The following would ensure time window consistency using OCC.
      // // We are dropping this for now. Without this a notification can enter a previous
      // // time window if something goes wrong. We recover from this by sending
      // // this notification in the next time window.
      // await this.knexConn('events').transacting(trx).insert({
      //   aggregate_uuid: timeWindowUUID,
      //   aggregate_type: 'TIME_WINDOW',
      //   payload_type: 'TIME_WINDOW_NOTIFICATION_ADDED',
      //   payload: { notification_uuid: uuid },
      //   version: lastTimeWindowVersion + 1
      // });

      await this.knexConn('events')
        .transacting(trx)
        .insert({
          aggregate_uuid: uuid,
          aggregate_type: 'NOTIFICATION',
          payload: notification,
          payload_type:
            newNotificationVersion === 1
              ? 'NOTIFICATION_STORED'
              : 'NOTIFICATION_UPDATED',
          version: newNotificationVersion,
        });

      await this.knexConn('notifications')
        .transacting(trx)
        .insert({
          uuid,
          user_uuid,
          message_payload,
          channel,
          template,
          subject,
          status: NotificationStatus.NOTIFICATION_PENDING,
          time_window_uuid: timeWindowUUID.uuid,
          unique_group_identifiers,
        })
        .onConflict('uuid')
        .merge();

      // await this.knexConn('notification_time_windows').transacting(trx).insert({
      //   notification_uuid: uuid,
      //   time_window_uuid: timeWindowUUID.uuid,
      //   unique_group_identifiers,
      // });
    });
  }

  // TODO: windowing
  // select last window
  // Insert new timewindow
  // SELECT all pending notifications from last window

  public async getGroupedNotifications(): Promise<
    (Partial<NotificationRow> & Partial<UserRow>)[]
  > {
    const res = await this.knexConn
      .from('notifications')
      .join('users', 'users.uuid', '=', 'notifications.user_uuid')
      .groupBy('users.uuid')
      .select<(Partial<NotificationRow> & Partial<UserRow>)[]>(
        'uuid',
        'message_payload',
        'template'
      );

    return res;
    // await this.knexConn.transaction()
  }
}
