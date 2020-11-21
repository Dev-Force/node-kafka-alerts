import { Consumer, EachMessagePayload } from 'kafkajs';
import { ICommand } from '../../domain/command.interface';
import { ICommandDispatcher } from '../../domain/command-dispatcher.interface';
import { NotificationMessage } from '../../domain/notification-message';
import { MessageTransformer } from '../../domain/message-transformer.interface';
import { IMessageConsumer } from '../../domain/message-consumer.interface';

export class KafkaJSConsumer implements IMessageConsumer {
  private consumer: Consumer;
  private topic: string;
  private commandBus: ICommandDispatcher<ICommand>;
  private messageTransformer: MessageTransformer;

  constructor(
    topic: string,
    consumer: Consumer,
    commandBus: ICommandDispatcher<ICommand>,
    messageTransformer: MessageTransformer
  ) {
    this.consumer = consumer;
    this.topic = topic;
    this.commandBus = commandBus;
    this.messageTransformer = messageTransformer;
  }

  consumeWindowedNotifications(): Promise<void> {
    // console.log('consumeWindowedNotifications is not yet implemented');
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

        const notificationMessage: NotificationMessage = this.messageTransformer.bufferMessageToNotificationMessage(
          message.value
        );

        const cmd = this.messageTransformer.createCommandFromNotificationMessage(
          notificationMessage
        );
        if (cmd == null) {
          // console.log(
          //   `invalid channel selected: ${notificationMessage.channel}`
          // );
          return;
        }

        await this.commandBus.dispatch(cmd);
      },
    });
  }
}
