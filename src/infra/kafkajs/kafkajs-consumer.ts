import { Consumer, EachMessagePayload } from 'kafkajs';
import { CommandMarker } from '../../interface-adapters/commands/command-marker.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { NotificationMessageContent } from '../../interface-adapters/notification-message-content';
import { SendInstantNotificationCommand } from '../../interface-adapters/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from '../../interface-adapters/commands/store-windowed-notification-command';

export class KafkaJSConsumer {
  private consumer: Consumer;
  private topic: string;
  private commandBus: CommandDispatcher<CommandMarker>;

  constructor(
    topic: string,
    consumer: Consumer,
    commandBus: CommandDispatcher<CommandMarker>
  ) {
    this.consumer = consumer;
    this.topic = topic;
    this.commandBus = commandBus;
  }

  async consumeWindowedNotifications(): Promise<void> {
    const { consumer, topic } = this;
    // console.log('topic', topic);

    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const { /*partition,*/ message } = payload;

        // console.log({
        //   partition,
        //   offset: message.offset,
        //   value: message.value.toString(),
        // });

        await this.commandBus.dispatch(
          new StoreWindowedNotificationCommand(
            this.deserializeMessage(message.value)
          )
        );
      },
    });

    return;
  }

  public async consumeInstantNotifications(): Promise<void> {
    const { consumer, topic } = this;
    // console.log('topic', topic);

    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const { /*partition,*/ message } = payload;

        // console.log({
        //   partition,
        //   offset: message.offset,
        //   value: message.value.toString(),
        // });

        await this.commandBus.dispatch(
          new SendInstantNotificationCommand(
            this.deserializeMessage(message.value)
          )
        );
      },
    });
  }

  private deserializeMessage(payload: Buffer): NotificationMessageContent {
    return JSON.parse(payload.toString('utf8'));
  }
}
