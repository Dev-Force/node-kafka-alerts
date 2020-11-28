import * as knex from 'knex';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { NotificationRepository } from '../../domain/port-interfaces/notification-repository.interface';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';
import { DatabaseAccessor } from '../../interface-adapters/database/database-accessor.interface';

export class KnexClient implements NotificationRepository, UserRepository {
  private knexConn: knex;
  private userAdapter: DatabaseAccessor;

  constructor(connStr: string, userAdapter: DatabaseAccessor) {
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: ['notification-service'],
    });
    this.userAdapter = userAdapter;
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
    await this.knexConn.transaction(async (trx) => {
      const {
        uuid,
        user: { uuid: userUUID },
        channel,
        unmappedData: message_payload,
        template,
        subject,
      } = notification;

      await this.knexConn('notification_events').transacting(trx).insert({
        uuid,
        type: 'NOTIFICATION_PENDING',
        body: message_payload,
      });

      await this.knexConn('notifications')
        .transacting(trx)
        .insert({
          uuid,
          user_uuid: userUUID,
          message_payload,
          channel,
          template,
          subject,
          status: NotificationStatus.PENDING,
        })
        .onConflict('uuid')
        .merge();
    });
  }
}
