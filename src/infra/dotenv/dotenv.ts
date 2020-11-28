import { config } from 'dotenv';
import { ConfigBuilder } from '../../domain/models/config-builder';

export class DotEnv {
  public initialize(): void {
    config();
  }

  public setConfigToBuilder(configBuilder: ConfigBuilder): void {
    configBuilder
      .setInstantNotificationTopic(process.env.INSTANT_NOTIFICATIONS_TOPIC)
      .setWindowedNotificationTopic(process.env.WINDOWED_NOTIFICATIONS_TOPIC)
      .setEmailSenderAPIKey(process.env.SENDGRID_API_KEY)
      .setKafkaGroupId(process.env.KAFKA_GROUP_ID)
      .setKafkaPort(process.env.KAFKA_PORT)
      .setKafkaHost('kafka')
      .setPostgresConnectionString(
        `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
      );
  }
}
