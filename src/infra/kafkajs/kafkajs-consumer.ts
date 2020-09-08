import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { SendEmailCommand } from '../../domain/commands/send-email-command';
import { ICommand } from '../../domain/commands/command.interface';
import { IDispatcher } from '../buses/dispatcher.interface';

export class KafkaJSConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(topic: string, private commandBus: IDispatcher<ICommand>) {
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['kafka:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'test-group' });
    this.topic = topic;
    this.commandBus = commandBus;
  }

  public async consume(): Promise<void> {
    const { consumer, topic } = this;

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
        const json = JSON.parse(val);

        if (json.send_email) {
          const cmd = new SendEmailCommand('from', 'to', 'template', {});
          await this.commandBus.dispatch(cmd);
          return;
        }

        return;
      },
    });
  }
}
