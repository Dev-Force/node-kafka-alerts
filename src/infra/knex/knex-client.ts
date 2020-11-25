import * as knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { User } from '../../domain/models/user';
import { NotificationRepository } from '../../domain/port-interfaces/notification-repository.interface';
import { UserRepository } from '../../domain/port-interfaces/user-repository.interface.';

export class KnexClient implements NotificationRepository, UserRepository {
  private knexConn: knex;

  constructor(connStr: string) {
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: ['notification-service'],
      debug: true,
    });
  }

  public async getUserByUUID(uuid: string): Promise<User> {
    const { email, phone } = await this.knexConn
      .select('email', 'phone')
      .from<{ email: string; phone: string }[]>('users')
      .where('uuid', uuid)
      .first();

    return new User(uuid, email, phone);
  }

  public async storeNewWindowedNotification(
    notification: Notification
  ): Promise<void> {
    await this.knexConn.transaction(async (trx) => {
      const {
        user: { uuid: user_uuid },
        channel,
        unmappedData: message_payload,
        template,
        subject,
      } = notification;
      const uuid: string = uuidv4();

      await this.knexConn('notification_events').transacting(trx).insert({
        uuid,
        type: 'NOTIFICATION_PENDING',
        body: message_payload,
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
          status: NotificationStatus.PENDING,
        })
        .onConflict('uuid')
        .merge();
    });
  }
}
