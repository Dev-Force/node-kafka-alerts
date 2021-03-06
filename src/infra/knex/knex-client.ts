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
import { UserAggregateType } from '../../domain/models/user';
import { UniqueTimeWindowNotificationError } from '../../domain/errors/unique-time-window-notification-error';
import { UniqueAggregateUUIDVersionError } from '../../domain/errors/unique-aggregate-uuid-version-error';
import { injectable } from 'inversify';
import { UniqueInstantAggregateUUIDVersionError } from '../../domain/errors/unique-instant-aggregate-uuid-version-error';

@injectable()
export class KnexClient implements NotificationDAO, UserDAO, TimeWindowDAO {
  private knexConn: knex;

  constructor(connStr: string, schemas: string[]) {
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: schemas,
    });
  }

  public destroy(): void {
    this.knexConn.destroy();
  }

  public async updateNotificationsToSent(
    notificationUUIDs: string[]
  ): Promise<void> {
    await this.knexConn.transaction(async (trx) => {
      for (const notUUID of notificationUUIDs) {
        const newNotificationVersion = await this.getNewNotificationVersion(
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

  public async saveUser(userRow: UserRow): Promise<void> {
    await this.knexConn.transaction(async (trx: knex.Transaction) => {
      const { uuid, email, phone } = userRow;

      const newUserVersion = await this.getNewUserVersion(trx, uuid);

      await this.knexConn('events')
        .transacting(trx)
        .insert({
          aggregate_uuid: uuid,
          aggregate_type: UserAggregateType,
          payload: userRow,
          payload_type: newUserVersion === 1 ? 'USER_CREATED' : 'USER_UPDATED',
          version: newUserVersion,
        });

      await this.knexConn('users')
        .insert({
          uuid,
          email,
          phone,
        })
        .onConflict('uuid')
        .merge();
    });
  }

  public async storeNewNotification(
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
        status,
      } = notification;

      await this.knexConn('events')
        .transacting(trx)
        .insert({
          aggregate_uuid: uuid,
          aggregate_type: NotificationAggregateType,
          payload: notification,
          payload_type: status,
          version: 1,
        })
        .catch((e) => {
          // version and aggregate_uuid unique constraint violation (OCC on notification update).
          if (
            e.code === '23505' &&
            /events_aggregate_uuid_version_key/.test(e.message)
          ) {
            throw new UniqueInstantAggregateUUIDVersionError(
              `Conflict while trying to insert event for instant notification with uuid ${uuid}`
            );
          }

          throw e;
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
          status,
        })
        .onConflict('uuid')
        .merge();
    });
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

      const newNotificationVersion = await this.getNewNotificationVersion(
        trx,
        uuid
      );

      const timeWindowUUID = await this.knexConn('time_windows')
        .transacting(trx)
        .select('uuid')
        .orderBy('id', 'desc')
        .first();

      await this.knexConn('events')
        .transacting(trx)
        .insert({
          aggregate_uuid: uuid,
          aggregate_type: NotificationAggregateType,
          payload: notification,
          payload_type:
            newNotificationVersion === 1
              ? 'NOTIFICATION_STORED'
              : 'NOTIFICATION_UPDATED',
          version: newNotificationVersion,
        })
        .catch((e) => {
          // version and aggregate_uuid unique constraint violation (OCC on notification update).
          if (
            e.code === '23505' &&
            /events_aggregate_uuid_version_key/.test(e.message)
          ) {
            throw new UniqueAggregateUUIDVersionError(
              `Conflict while trying to insert event for windowed notification with uuid ${uuid}`
            );
          }

          throw e;
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
        })
        .onConflict('uuid')
        .merge();

      await this.knexConn('notification_time_windows')
        .transacting(trx)
        .insert({
          notification_uuid: uuid,
          time_window_uuid: timeWindowUUID.uuid,
          user_uuid,
          unique_group_identifiers,
        })
        .catch((e) => {
          // Handle exception for unique time_window_uuid, unique_group_identifiers, user combo.
          if (
            e.code === '23505' &&
            /notification_time_windows_unique_group_identifiers_user_uui_key/.test(
              e.message
            )
          ) {
            throw new UniqueTimeWindowNotificationError(
              `Notification already exists for the current time window with uuid ${
                timeWindowUUID.uuid
              } for user with uuid ${user_uuid} and unique group identifiers ${JSON.stringify(
                unique_group_identifiers,
                null,
                2
              )}`
            );
          }

          throw e;
        });
    });
  }

  public async getAllPendingNotifications(): Promise<GroupedNotificationRow[]> {
    return await this.knexConn
      .from('notifications')
      .join('users', 'users.uuid', '=', 'notifications.user_uuid')
      .join(
        'notification_time_windows',
        'notification_time_windows.user_uuid',
        '=',
        'notifications.user_uuid'
      )
      .where('notifications.status', NotificationStatus.NOTIFICATION_PENDING)
      // if we want to filter pending notifications by time window we uncomment the below line.
      // .andWhere('time_windows.uuid', 'UUID_HERE')
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

  private async getNewUserVersion(
    trx: knex.Transaction,
    userUUID: string
  ): Promise<number> {
    const lastUserVersion = await this.knexConn('events')
      .transacting(trx)
      .select('version')
      .where('aggregate_uuid', userUUID)
      .andWhere('aggregate_type', UserAggregateType)
      .orderBy('id', 'desc')
      .first();

    return lastUserVersion != null ? lastUserVersion.version + 1 : 1;
  }

  private async getNewNotificationVersion(
    trx: knex.Transaction,
    notificationUUID: string
  ): Promise<number> {
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
