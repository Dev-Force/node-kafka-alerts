export class Config {
  private instantNotificationTopic: string;
  private windowedNotificationTopic: string;
  private emailSenderAPIKey: string;
  private templatePath: string;
  private kafkaGroupId: string;
  private kafkaHost: string;
  private kafkaPort: string;
  private postgresConnectionString: string;

  public setInstantNotificationTopic(instantNotTopic: string): Config {
    this.instantNotificationTopic = instantNotTopic;
    return this;
  }

  public getInstantNotificationTopic(): string {
    return this.instantNotificationTopic;
  }

  public setWindowedNotificationTopic(windowedNotTopic: string): Config {
    this.windowedNotificationTopic = windowedNotTopic;
    return this;
  }

  public getWindowedNotificationTopic(): string {
    return this.windowedNotificationTopic;
  }

  public setEmailSenderAPIKey(key: string): Config {
    this.emailSenderAPIKey = key;
    return this;
  }

  public getEmailSenderAPIKey(): string {
    return this.emailSenderAPIKey;
  }

  public setTemplatePath(templatePath: string): Config {
    this.templatePath = templatePath;
    return this;
  }

  public getTemplatePath(): string {
    return this.templatePath;
  }

  public setKafkaGroupId(kafkaGroupId: string): Config {
    this.kafkaGroupId = kafkaGroupId;
    return this;
  }

  public getKafkaGroupId(): string {
    return this.kafkaGroupId;
  }

  public getKafkaHost(): string {
    return this.kafkaHost;
  }

  public setKafkaHost(value: string): Config {
    this.kafkaHost = value;
    return this;
  }

  public getKafkaPort(): string {
    return this.kafkaPort;
  }

  public setKafkaPort(value: string): Config {
    this.kafkaPort = value;
    return this;
  }

  public getPostgresConnectionString(): string {
    return this.postgresConnectionString;
  }

  public setPostgresConnectionString(value: string): Config {
    this.postgresConnectionString = value;
    return this;
  }
}
