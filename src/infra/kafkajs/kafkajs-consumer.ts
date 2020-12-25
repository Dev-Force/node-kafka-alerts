import { Consumer, EachBatchPayload } from 'kafkajs';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from '../../domain/commands/store-windowed-notification-command';
import { SaveUserCommand } from '../../domain/commands/save-user-command';
import { isSkippableError } from '../../domain/errors/skippable-error.decorator';
import { isRetryableError } from '../../domain/errors/retryable-error.decorator';

export class KafkaJSConsumer {
  constructor(
    private instantNotificationTopic: string,
    private windowedNotificationsTopic: string,
    private userTopic: string,
    private consumer: Consumer,
    private commandBus: CommandDispatcher<CommandMarker>
  ) {}

  async consume(): Promise<void> {
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
                console.log('no such topic command');
            }
          } catch (e) {
            // if error is retryable throw error to eachBatch.
            if (isRetryableError(e)) {
              console.log('Retryable error:', e.message);
              throw e;
            }

            // if error is skippable resolve offset.
            if (isSkippableError(e)) {
              console.log('Skippable error:', e.message);
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
