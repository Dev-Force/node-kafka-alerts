export interface BrokerConsumer {
  disconnect(): void;
  consume(): Promise<void>;
}
