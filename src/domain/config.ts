export class Config {
  private notificationTopic: string;

  public setNotificationTopic(notTopic: string): Config {
    this.notificationTopic = notTopic;
    return this;
  }

  public getNotificationTopic(): string {
    return this.notificationTopic;
  }
}
