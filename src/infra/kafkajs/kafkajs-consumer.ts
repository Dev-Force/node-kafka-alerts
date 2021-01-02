import { Consumer, EachBatchPayload } from 'kafkajs';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from '../../domain/commands/store-windowed-notification-command';
import { SaveUserCommand } from '../../domain/commands/save-user-command';
import { isSkippableError } from '../../domain/errors/skippable-error.decorator';
import { isRetryableError } from '../../domain/errors/retryable-error.decorator';
import { inject, injectable } from 'inversify';
import { Logger } from '../../domain/port-interfaces/logger.interface';
import { BrokerConsumer } from '../../domain/port-interfaces/broker-consumer.interface';
import { Types } from '../../types';

@injectable()
export class KafkaJSConsumer implements BrokerConsumer {
  constructor(
    @inject(Types.InstantNotificationTopic)
    private instantNotificationTopic: string,
    @inject(Types.WindowedNotificationsTopic)
    private windowedNotificationsTopic: string,
    @inject(Types.UserTopic) private userTopic: string,
    @inject(Types.KafkaConsumer) private consumer: Consumer,
    @inject(Types.CommandDispatcher)
    private commandBus: CommandDispatcher<CommandMarker>,
    @inject(Types.Logger) private logger: Logger
  ) {}

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  public async consume(): Promise<void> {
    const {
      consumer,
      instantNotificationTopic,
      windowedNotificationsTopic,
      userTopic,
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
    await consumer.subscribe({
      topic: userTopic,
      fromBeginning: true,
    });

    await consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch, resolveOffset, heartbeat } = payload;

        for (const message of batch.messages) {
          try {
            switch (batch.topic) {
              case instantNotificationTopic:
                await this.commandBus.dispatch(
                  new SendInstantNotificationCommand(
                    this.deserializeMessage<NotificationMessageContent>(
                      message.value
                    )
                  )
                );
                break;

              case windowedNotificationsTopic:
                await this.commandBus.dispatch(
                  new StoreWindowedNotificationCommand(
                    this.deserializeMessage<NotificationMessageContent>(
                      message.value
                    )
                  )
                );
                break;

              case userTopic:
                const { uuid, email, phone } = this.deserializeMessage<
                  SaveUserCommand
                >(message.value);
                await this.commandBus.dispatch(
                  new SaveUserCommand(uuid, email, phone)
                );
                break;

              default:
                this.logger.info({ message: 'no such topic command' });
            }
          } catch (e) {
            // if error is retryable throw error to eachBatch.
            if (isRetryableError(e)) {
              this.logger.info({ message: `Retryable error: ${e.message}` });
              throw e;
            }

            // if error is skippable resolve offset.
            if (isSkippableError(e)) {
              this.logger.info({ message: `Skippable error: ${e.message}` });
              resolveOffset(message.offset);
              await heartbeat();
              continue;
            }

            // default behaviour.
            throw e;
          }

          resolveOffset(message.offset);
          await heartbeat();
        }
      },
    });

    return;
  }

  private deserializeMessage<Output>(payload: Buffer): Output {
    return JSON.parse(payload.toString('utf8'));
  }
}
