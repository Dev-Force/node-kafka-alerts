import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';

import { Consumer, Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { FSAsync } from './infra/fs-async/fs-async';
import { SendInstantNotificationCommandHandler } from './interface-adapters/controllers/send-instant-notification.command-handler';
import { KnexClient } from './infra/knex/knex-client';
import { StoreWindowedNotificationCommandHandler } from './interface-adapters/controllers/store-windowed-notification.command-handler';
import { StoreWindowedNotificationUseCase } from './use-cases/store-windowed-notification/store-windowed-notification.use-case';
import { ConfigComposer } from './infra/config-composer/config-composer';
import { SendWindowedNotificationsUseCase } from './use-cases/send-windowed-notifications/send-windowed-notifications.use-case';
import { NotificationDataMapper } from './interface-adapters/gateways/notification-data-mapper';
import { UserDataMapper } from './interface-adapters/gateways/user-data-mapper';
import { TimeWindowDataMapper } from './interface-adapters/gateways/time-window-data-mapper';
import { Cron } from './infra/cron/cron';
import { SendWindowedNotificationsCommandHandler } from './interface-adapters/controllers/send-windowed-notifications.command-handler';
import { SendGridClient } from './infra/sendgrid/sendgrid-client';
import { SaveUserCommandHandler } from './interface-adapters/controllers/save-user.command-handler';
import { SaveUserUseCase } from './use-cases/save-user/save-user.use-case';
import { Pino } from './infra/pino/pino';
import { Logger } from './domain/port-interfaces/logger.interface';
import { Container } from 'inversify';
import { BrokerConsumer } from './domain/port-interfaces/broker-consumer.interface';
import { CommandDispatcher } from './domain/port-interfaces/command-dispatcher.interface';
import { CommandMarker } from './domain/commands/command-marker.interface';
import { FileReader } from './domain/port-interfaces/file-reader.interface';
import { EmailSender } from './domain/port-interfaces/email-sender.interface';
import { Compiler } from './domain/port-interfaces/compiler.interface';
import { NotificationDAO } from './interface-adapters/gateways/notification-dao.interface';
import { UserDAO } from './interface-adapters/gateways/user-dao.interface';
import { TimeWindowDAO } from './interface-adapters/gateways/time-window-dao.interface';
import { NotificationFetcher } from './domain/port-interfaces/notification-fetcher.interface';
import { NotificationCreator } from './domain/port-interfaces/notification-creator.interface';
import { NotificationMutator } from './domain/port-interfaces/notification-mutator.interface';
import { ConfigTemplate } from './domain/models/config-template';
import { UserSaver } from './domain/port-interfaces/user-saver.interface';
import { UserFetcher } from './domain/port-interfaces/user-fetcher.interface';
import { TimeWindowCreator } from './domain/port-interfaces/time-window-creator.interface';
import { TimeWindowFetcher } from './domain/port-interfaces/time-window-fetcher.interface';
import { UseCaseExecutor } from './use-cases/use-case-executor.interface';
import { SaveUserPayload } from './use-cases/save-user/save-user-payload';
import { StoreWindowedNotificationPayload } from './use-cases/store-windowed-notification/store-windowed-notification-payload';
import { SendEmailPayload } from './use-cases/send-email/send-email-payload';
import { ICommandHandler } from './domain/port-interfaces/command-handler.interface';
import { SendInstantNotificationCommand } from './domain/commands/send-instant-notification-command';
import { StoreWindowedNotificationCommand } from './domain/commands/store-windowed-notification-command';
import { SendWindowedNotificationsCommand } from './domain/commands/send-windowed-notifications-command';
import { SaveUserCommand } from './domain/commands/save-user-command';
import { CronExecer } from './domain/port-interfaces/cron-execer';
import { commandHandlers } from './interface-adapters/controllers/command-handler.decorator';
import {
  commandHandlerDirPath,
  commandHandlerFileSuffix,
} from './interface-adapters/controllers/command-handler.constants';

const configComposer = new ConfigComposer();
configComposer.initialize();
const config = configComposer.composeConfig();
const container = new Container();

// LOGGER FIRST
container
  .bind<boolean>('LoggerPrettify')
  .toConstantValue(process.env.NODE_ENV !== 'production');
container.bind<Logger>('Logger').to(Pino).inSingletonScope();

// CONSTANTS
container
  .bind<string>('EmailSenderAPIKey')
  .toConstantValue(config.emailSenderAPIKey);
container
  .bind<string>('InstantNotificationTopic')
  .toConstantValue(config.instantNotificationTopic);
container
  .bind<string>('WindowedNotificationsTopic')
  .toConstantValue(config.windowedNotificationTopic);
container.bind<string>('UserTopic').toConstantValue(config.userTopic);
const kafka = new Kafka({
  clientId: config.kafkaClientID,
  brokers: [`${config.kafkaHost}:${config.kafkaPort}`],
  logCreator: () => {
    return ({ log }) => {
      const { message, ...extra } = log;
      container.get<Logger>('Logger').info({
        message,
        extra,
      });
    };
  },
});
container
  .bind<Consumer>('KafkaConsumer')
  .toConstantValue(kafka.consumer({ groupId: config.kafkaGroupId }));
container
  .bind<string>('PostgresConnectionString')
  .toConstantValue(config.postgresConnectionString);
container
  .bind<string[]>('DatabaseSchemas')
  .toConstantValue(config.databaseSchemas);
container
  .bind<ConfigTemplate[]>('ConfigTemplates')
  .toConstantValue(config.templates);
container
  .bind<string>('TemplateDirPath')
  .toConstantValue(path.join(__dirname, '..', config.templatePath));
container
  .bind<string>('TemplateExtension')
  .toConstantValue(config.templateExtension);
container.bind<string>('FromEmail').toConstantValue(config.fromEmail);
container
  .bind<string>('CronExpression')
  .toConstantValue(config.sendWindowedNotificationsCronExpression);

// PRIMARY ACTORS
container.bind<BrokerConsumer>('BrokerConsumer').to(KafkaJSConsumer);
container.bind<CronExecer>('CronExecer').to(Cron);

// DRIVEN ACTORS]
const commandBus = new CommandBus();
container
  .bind<CommandDispatcher<CommandMarker>>('CommandDispatcher')
  .toConstantValue(commandBus);
container.bind<FileReader>('FileReader').to(FSAsync);
container.bind<EmailSender>('EmailSender').to(SendGridClient);
container.bind<Compiler>('Compiler').to(HandlebarsCompiler);

// DAOs
const knexClient = new KnexClient(
  config.postgresConnectionString,
  config.databaseSchemas
);
container.bind<NotificationDAO>('NotificationDAO').toConstantValue(knexClient);
container.bind<UserDAO>('UserDAO').toConstantValue(knexClient);
container.bind<TimeWindowDAO>('TimeWindowDAO').toConstantValue(knexClient);

// DATA MAPPERS
container
  .bind<NotificationFetcher>('NotificationFetcher')
  .to(NotificationDataMapper);
container
  .bind<NotificationCreator>('NotificationCreator')
  .to(NotificationDataMapper);
container
  .bind<NotificationMutator>('NotificationMutator')
  .to(NotificationDataMapper);
container.bind<UserSaver>('UserSaver').to(UserDataMapper);
container.bind<UserFetcher>('UserFetcher').to(UserDataMapper);
container.bind<TimeWindowCreator>('TimeWindowCreator').to(TimeWindowDataMapper);
container.bind<TimeWindowFetcher>('TimeWindowFetcher').to(TimeWindowDataMapper);

// USE CASES
container
  .bind<UseCaseExecutor<SaveUserPayload, Promise<void>>>('SaveUserUseCase')
  .to(SaveUserUseCase);
container
  .bind<UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>>>(
    'StoreWindowedNotificationUseCase'
  )
  .to(StoreWindowedNotificationUseCase);
container
  .bind<UseCaseExecutor<void, Promise<void>>>(
    'SendWindowedNotificationsUseCase'
  )
  .to(SendWindowedNotificationsUseCase);
container
  .bind<UseCaseExecutor<SendEmailPayload, Promise<void>>>('SendEmailUseCase')
  .to(SendEmailUseCase);

// COMMAND HANDLERS
container
  .bind<ICommandHandler<SendInstantNotificationCommand>>(
    'SendInstantNotificationCommandHandler'
  )
  .to(SendInstantNotificationCommandHandler);
container
  .bind<ICommandHandler<StoreWindowedNotificationCommand>>(
    'StoreWindowedNotificationCommandHandler'
  )
  .to(StoreWindowedNotificationCommandHandler);
container
  .bind<ICommandHandler<SendWindowedNotificationsCommand>>(
    'SendWindowedNotificationsCommandHandler'
  )
  .to(SendWindowedNotificationsCommandHandler);
container
  .bind<ICommandHandler<SaveUserCommand>>('SaveUserCommandHandler')
  .to(SaveUserCommandHandler);

// BOOTSTRAP
// Import all command handlers
fs.readdirSync(`${commandHandlerDirPath}`)
  .filter((file) => file.includes(commandHandlerFileSuffix))
  .forEach((file) => {
    require(`${commandHandlerDirPath}/${file}`);
  });

// Register all imported command handlers
commandHandlers.forEach((ch) => commandBus.registerDecorated(ch));

const cron = container.get<CronExecer>('CronExecer');
cron.onTickSendWindowedNotifications();
cron.startNewCronJob();

const brokerConsumer = container.get<BrokerConsumer>('BrokerConsumer');
brokerConsumer.consume();

// const expressApp = new ExpressServer(commandBus);
// expressApp.init();

process.on('SIGINT', function () {
  Promise.all([knexClient.destroy(), brokerConsumer.disconnect()])
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
});
