import { Consumer, EachMessagePayload } from 'kafkajs';
import { SendEmailCommand } from '../../domain/commands/send-email-command';
import { ICommand } from '../../domain/commands/command.interface';
import { IDispatcher } from '../buses/dispatcher.interface';
import { NotificationMessage } from '../../domain/notification-message';

export class KafkaJSConsumer {
  private consumer: Consumer;
  private topic: string;
  private commandBus: IDispatcher<ICommand>;

  constructor(
    topic: string,
    consumer: Consumer,
    commandBus: IDispatcher<ICommand>
  ) {
    this.consumer = consumer;
    this.topic = topic;
    this.commandBus = commandBus;
  }

  public async consume(): Promise<void> {
    const { consumer, topic } = this;
    console.log('topic', topic);

    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const { partition, message } = payload;

        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });

        const val = message.value.toString('utf8');
        const json: NotificationMessage = JSON.parse(val);

        const {
          channel,
          recipient,
          subject,
          isHTML,
          template,
          unmappedData,
        } = json;

        if (channel === 'EMAIL') {
          const cmd = new SendEmailCommand(
            'noreply@devforce.gr',
            recipient,
            subject,
            isHTML,
            template,
            unmappedData
          );
          await this.commandBus.dispatch(cmd);
          return;
        }

        return;
      },
    });
  }
}
