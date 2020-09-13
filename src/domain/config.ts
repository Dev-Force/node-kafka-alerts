export class Config {
  private notificationTopic: string;
  private emailSenderAPIKey: string;
  private templatePath: string;
  private kakfaGroupId: string;
  private kakfaHost: string;
  private kakfaPort: string;

  public setNotificationTopic(notTopic: string): Config {
    this.notificationTopic = notTopic;
    return this;
  }

  public getNotificationTopic(): string {
    return this.notificationTopic;
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
}
