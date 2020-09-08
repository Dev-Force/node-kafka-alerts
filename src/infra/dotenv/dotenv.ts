import { config } from 'dotenv';
import { Domain } from 'domain';
import { Config } from '../../domain/config';

export class DotEnv {
  public initialize(): void {
    config();
  }

  public getConfig(): Config {
    return new Config().setNotificationTopic(process.env.NOTIFICATION_TOPIC);
  }
}
