import { ConsumerGroup } from 'kafka-node';
import { JsonMessageHandler } from '../../domain/json-message-handler';
import { kafkaNodeConsumerOptions } from './kafka-node-consumer-options';

export class KafkaNodeConsumer {
  private consumerGroup: ConsumerGroup;

  constructor(
    topics: string | string[],
    private jsonMessageHandler: JsonMessageHandler
  ) {
    this.consumerGroup = new ConsumerGroup(
      kafkaNodeConsumerOptions as any,
      topics
    );
    this.jsonMessageHandler = jsonMessageHandler;
  }

  public consume(): void {
    this.consumerGroup.on('message', (message) => {
      const val = message.value.toString('utf8');
      const json = JSON.parse(val);

      this.jsonMessageHandler.handle(json);
    });
  }
}
