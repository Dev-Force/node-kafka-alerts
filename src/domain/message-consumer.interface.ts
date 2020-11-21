export interface IMessageConsumer {
  consumeInstantNotifications(): Promise<void>;
  consumeWindowedNotifications(): Promise<void>;
}
