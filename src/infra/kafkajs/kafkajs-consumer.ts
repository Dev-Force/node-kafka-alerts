import { Consumer, EachMessagePayload } from 'kafkajs';
import { CommandMarker } from '../../interface-adapters/commands/command-marker.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { NotificationMessageContent } from '../../interface-adapters/notification-message-content';
import { SendInstantNotificationCommand } from '../../interface-adapters/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from '../../interface-adapters/commands/store-windowed-notification-command';

export class KafkaJSConsumer {
  private consumer: Consumer;
  private instantNotificationTopic: string;
  private windowedNotificationsTopic: string;
  private commandBus: CommandDispatcher<CommandMarker>;

  constructor(
    instantNotificationTopic: string,
    windowedNotificationsTopic: string,
    consumer: Consumer,
    commandBus: CommandDispatcher<CommandMarker>
  ) {
    this.consumer = consumer;
    this.instantNotificationTopic = instantNotificationTopic;
    this.windowedNotificationsTopic = windowedNotificationsTopic;
    this.commandBus = commandBus;
  }

  async consume(): Promise<void> {
    const {
      consumer,
      instantNotificationTopic,
      windowedNotificationsTopic,
    } = this;

    // Consuming
    await consumer.connect();
    await consumer.subscribe({
      topic: instantNotificationTopic,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: windowedNotificationsTopic,
      fromBeginning: true,
    });

    // TODO: On some errors retry.
    // Else skip message. (right now, all messages are skipped if there is an error.)
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const { message, topic } = payload;

        switch (topic) {
          case instantNotificationTopic:
            await this.commandBus.dispatch(
              new SendInstantNotificationCommand(
                this.deserializeMessage(message.value)
              )
            );
            break;

          case windowedNotificationsTopic:
            await this.commandBus.dispatch(
              new StoreWindowedNotificationCommand(
                this.deserializeMessage(message.value)
              )
            );
            break;

          default:
            console.log('no such topic command');
        }
      },
    });

    return;
  }

  private deserializeMessage(payload: Buffer): NotificationMessageContent {
    return JSON.parse(payload.toString('utf8'));
  }
}
