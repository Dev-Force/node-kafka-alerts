export class Config {
  private notificationTopic: string;
  private emailSenderAPIKey: string;

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
}
