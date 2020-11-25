export class Config {
  private instantNotificationTopic: string;
  private windowedNotificationTopic: string;
  private emailSenderAPIKey: string;
  private templatePath: string;
  private kakfaGroupId: string;
  private kakfaHost: string;
  private kakfaPort: string;
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

  public setKafkaGroupId(kakfaGroupId: string): Config {
    this.kakfaGroupId = kakfaGroupId;
    return this;
  }

  public getKafkaGroupId(): string {
    return this.kakfaGroupId;
  }

  public getKakfaHost(): string {
    return this.kakfaHost;
  }

  public setKakfaHost(value: string): Config {
    this.kakfaHost = value;
    return this;
  }

  public getKakfaPort(): string {
    return this.kakfaPort;
  }

  public setKakfaPort(value: string): Config {
    this.kakfaPort = value;
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
