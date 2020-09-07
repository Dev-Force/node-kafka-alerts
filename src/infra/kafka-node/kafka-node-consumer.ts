import { ConsumerGroup } from 'kafka-node';
import { kafkaNodeConsumerOptions } from './kafka-node-consumer-options';
import { SendEmailCommand } from '../../domain/commands/send-email-command';
import { ICommand } from '../../domain/commands/command.interface';
import { IDispatcher } from '../buses/dispatcher.interface';

export class KafkaNodeConsumer {
  private consumerGroup: ConsumerGroup;

  constructor(
    topics: string | string[],
    private commandBus: IDispatcher<ICommand>
  ) {
    this.consumerGroup = new ConsumerGroup(
      kafkaNodeConsumerOptions as any,
      topics
    );
    this.commandBus = commandBus;
  }

  public consume(): void {
    this.consumerGroup.on('message', (message) => {
      const val = message.value.toString('utf8');
      const json = JSON.parse(val);

      if (json.send_email) {
        const cmd = new SendEmailCommand('from', 'to', 'template', {});
        return this.commandBus.dispatch(cmd);
      }

      return;
    });
  }
}
