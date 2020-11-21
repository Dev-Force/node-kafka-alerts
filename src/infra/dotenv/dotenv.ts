import { config } from 'dotenv';
import { Config } from '../../domain/config';

export class DotEnv {
  public initialize(): void {
    config();
  }

  public getConfig(): Config {
    return new Config()
      .setInstantNotificationTopic(process.env.INSTANT_NOTIFICATIONS_TOPIC)
      .setWindowedNotificationTopic(process.env.WINDOWED_NOTIFICATIONS_TOPIC)
      .setEmailSenderAPIKey(process.env.SENDGRID_API_KEY)
      .setTemplatePath(process.env.TEMPLATE_PATH)
      .setKafkaGroupId(process.env.KAFKA_GROUP_ID);
  }
}
