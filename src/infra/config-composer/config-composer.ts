import { config as envConfig } from 'dotenv';
import * as fileConfig from 'config';
import { Config as DomainConfig } from '../../domain/models/config';
import { ConfigBuilder } from '../../domain/models/config-builder';
import { ConfigTemplate } from '../../domain/models/config-template';

export class ConfigComposer {
  public initialize(): void {
    envConfig();
  }

  public composeConfig(): DomainConfig {
    return (
      new ConfigBuilder()
        // from ENV
        .setInstantNotificationTopic(process.env.INSTANT_NOTIFICATIONS_TOPIC)
        .setWindowedNotificationTopic(process.env.WINDOWED_NOTIFICATIONS_TOPIC)
        .setUserTopic(process.env.USERS_TOPIC)
        .setEmailSenderAPIKey(process.env.SENDGRID_API_KEY)
        .setKafkaGroupId(process.env.KAFKA_GROUP_ID)
        .setKafkaPort(process.env.KAFKA_PORT)
        .setKafkaHost(process.env.KAFKA_HOST)
        .setPostgresConnectionString(
          `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
        )
        .setSendWindowedNotificationsCronExpression(
          process.env.SEND_WINDOWED_NOTIFICATIONS_CRON_EXPRESSION
        )
        // from FILE
        .setTemplatePath(fileConfig.get<string>('templatePath'))
        .setTemplateExtension(fileConfig.get<string>('templateExtension'))
        .setFromEmail(fileConfig.get<string>('fromEmail'))
        .setTemplates(fileConfig.get<ConfigTemplate[]>('templates'))
        .setDatabaseSchemas(fileConfig.get<string[]>('databaseSchemas'))
        .build()
    );
  }
}
