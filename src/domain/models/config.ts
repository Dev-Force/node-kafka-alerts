import { ConfigTemplate } from './config-template';

export class Config {
  public instantNotificationTopic: string;
  public windowedNotificationTopic: string;
  public emailSenderAPIKey: string;
  public kafkaGroupId: string;
  public kafkaHost: string;
  public kafkaPort: string;
  public postgresConnectionString: string;
  public databaseSchemas: string[];
  public templatePath: string;
  public templateExtension: string;
  public fromEmail: string;
  public templates: ConfigTemplate[];
}
