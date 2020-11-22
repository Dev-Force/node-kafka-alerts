import * as knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../domain/models/notification';
import { NotificationStatus } from '../../domain/models/notification-status';
import { NotificationGateway } from '../../domain/port-interfaces/notification-gateway.interface';

export class KnexClient implements NotificationGateway {
  private knexConn: knex;

  constructor(connStr: string) {
    // TODO: handle knex await for connection.
    this.knexConn = knex({
      client: 'pg',
      connection: connStr,
      searchPath: 'notifications',
      pool: { min: 0, max: 8 },
    });
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

      // TODO: commit or rollback
    });
  }
}
