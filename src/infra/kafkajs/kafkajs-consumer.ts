import { Consumer, EachMessagePayload } from 'kafkajs';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { NotificationMessageContent } from '../../domain/notification-message-content';
import { SendInstantNotificationCommand } from '../../domain/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from '../../domain/commands/store-windowed-notification-command';
import { SaveUserCommand } from '../../domain/commands/save-user-command';

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

    // TODO: On some errors retry.
    // Else skip message. (right now, all messages are skipped if there is an error.)
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const { message, topic } = payload;

        switch (topic) {
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
      },
    });

    return;
  }

  private deserializeMessage<Output>(payload: Buffer): Output {
    return JSON.parse(payload.toString('utf8'));
  }
}
