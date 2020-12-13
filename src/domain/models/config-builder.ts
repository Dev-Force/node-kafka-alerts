import { Config } from './config';
import { ConfigTemplate } from './config-template';

export class ConfigBuilder {
  private config: Config;

  constructor() {
    this.config = new Config();
  }

  public reset(): void {
    this.config = new Config();
  }

  public setInstantNotificationTopic(instantNotTopic: string): this {
    this.config.instantNotificationTopic = instantNotTopic;
    return this;
  }

  public setWindowedNotificationTopic(windowedNotTopic: string): this {
    this.config.windowedNotificationTopic = windowedNotTopic;
    return this;
  }

  public setEmailSenderAPIKey(key: string): this {
    this.config.emailSenderAPIKey = key;
    return this;
  }

  public setKafkaGroupId(kafkaGroupId: string): this {
    this.config.kafkaGroupId = kafkaGroupId;
    return this;
  }

  public setKafkaHost(value: string): this {
    this.config.kafkaHost = value;
    return this;
  }

  public setKafkaPort(value: string): this {
    this.config.kafkaPort = value;
    return this;
  }

  public setPostgresConnectionString(value: string): this {
    this.config.postgresConnectionString = value;
    return this;
  }

  public setTemplatePath(value: string): this {
    this.config.templatePath = value;
    return this;
  }

  public setTemplateExtension(value: string): this {
    this.config.templateExtension = value;
    return this;
  }

  public setFromEmail(value: string): this {
    this.config.fromEmail = value;
    return this;
  }

  public setTemplates(value: ConfigTemplate[]): this {
    this.config.templates = value;
    return this;
  }

  public setDatabaseSchemas(value: string[]): this {
    this.config.databaseSchemas = value;
    return this;
  }

  public setSendWindowedNotificationsCronExpression(value: string): this {
    this.config.sendWindowedNotificationsCronExpression = value;
    return this;
  }

  public build(): Config {
    return this.config;
  }
}
