import * as knex from 'knex';
import { NotificationStatus } from '../../domain/models/notification-status';
import { TimeWindow } from '../../domain/models/time-window';
import { NotificationRow } from '../../interface-adapters/gateways/notification-row';
import { UserRow } from '../../interface-adapters/gateways/user-row';
import { v4 as uuidv4 } from 'uuid';
import { NotificationDAO } from '../../interface-adapters/gateways/notification-dao.interface';
import { UserDAO } from '../../interface-adapters/gateways/user-dao.interface';
import { TimeWindowDAO } from '../../interface-adapters/gateways/time-window-dao.interface';
import { TimeWindowRow } from '../../interface-adapters/gateways/time-window-row';
import { GroupedNotificationRow } from '../../interface-adapters/gateways/grouped-notification-row';
import { NotificationAggregateType } from '../../domain/models/notification';

export class KnexClient implements NotificationDAO, UserDAO, TimeWindowDAO {
  private knexConn: knex;

  constructor(connStr: string, schemas: string[]) {
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: schemas,
    });
  }

  public async updateNotificationsToSent(
    notificationUUIDs: string[]
  ): Promise<void> {
    await this.knexConn.transaction(async (trx) => {
      for (const notUUID of notificationUUIDs) {
        const newNotificationVersion = await this.getLatestNotificationVersion(
          trx,
          notUUID
        );

        await this.knexConn('events').transacting(trx).insert({
          aggregate_uuid: notUUID,
          aggregate_type: NotificationAggregateType,
          payload: {},
          payload_type: NotificationStatus.NOTIFICATION_SENT,
          version: newNotificationVersion,
        });

        await this.knexConn('notifications')
          .transacting(trx)
          .update({ status: NotificationStatus.NOTIFICATION_SENT })
          .where('uuid', notUUID);
      }
    });
  }

  public async getLatestTimeWindow(): Promise<TimeWindowRow> {
    const { uuid } = await this.knexConn('time_windows')
      .select('uuid')
      .orderBy('id', 'desc')
      .first();

    const timeWindow = new TimeWindow(uuid);

    return timeWindow;
  }

  public async createNewTimeWindow(): Promise<void> {
    await this.knexConn('time_windows').insert({
      uuid: uuidv4(),
    });
  }

  public async getUserByUUID(uuid: string): Promise<UserRow> {
    const { email, phone } = await this.knexConn
      .select('email', 'phone')
      .from<{ email: string; phone: string }[]>('users')
      .where('uuid', uuid)
      .first();

    return { uuid, email, phone };
  }

  public async storeNewWindowedNotification(
    notification: NotificationRow
  ): Promise<void> {
    await this.knexConn.transaction(async (trx: knex.Transaction) => {
      const {
        uuid,
        user_uuid,
        channel,
        message_payload,
        template,
        subject,
        unique_group_identifiers,
      } = notification;

      const newNotificationVersion = await this.getLatestNotificationVersion(
        trx,
        uuid
      );

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

      // TODO: version and aggregate_uuid unique constraint violation (OCC on notification update)
      // (rarely happens) retries consumption kafka message.

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

      // TODO: handle exception for unique time_window_uuid and unique_group_identifiers combo.
      // We need to skip kafka message if a unique constraint violation happens.
    });
  }

  public async getAllPendingNotifications(): Promise<GroupedNotificationRow[]> {
    // TODO: per time window or per status

    return await this.knexConn
      .from('notifications')
      .join('users', 'users.uuid', '=', 'notifications.user_uuid')
      .groupBy('users.uuid', 'notifications.template', 'notifications.channel')
      .select<GroupedNotificationRow[]>(
        'users.uuid as user_uuid',
        'template',
        'channel',
        this.knexConn.raw(
          'array_agg(notifications.uuid) as notification_uuids'
        ),
        this.knexConn.raw('json_agg(message_payload::json) as message_payloads')
      );
  }

  private async getLatestNotificationVersion(
    trx: knex.Transaction,
    notificationUUID: string
  ) {
    const lastNotificationVersion = await this.knexConn('events')
      .transacting(trx)
      .select('version')
      .where('aggregate_uuid', notificationUUID)
      .andWhere('aggregate_type', NotificationAggregateType)
      .orderBy('id', 'desc')
      .first();

    return lastNotificationVersion != null
      ? lastNotificationVersion.version + 1
      : 1;
  }
}
