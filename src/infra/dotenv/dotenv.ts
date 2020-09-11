import { config } from 'dotenv';
import { Config } from '../../domain/config';

export class DotEnv {
  public initialize(): void {
    config();
  }

  public getConfig(): Config {
    return new Config()
      .setNotificationTopic(process.env.NOTIFICATION_TOPIC)
      .setEmailSenderAPIKey(process.env.SENDGRID_API_KEY)
      .setTemplatePath(process.env.TEMPLATE_PATH);
  }
}
