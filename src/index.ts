import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';

import { Consumer, Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { FSAsync } from './infra/fs-async/fs-async';
import { KnexClient } from './infra/knex/knex-client';
import { StoreWindowedNotificationUseCase } from './use-cases/store-windowed-notification/store-windowed-notification.use-case';
import { ConfigComposer } from './infra/config-composer/config-composer';
import { SendWindowedNotificationsUseCase } from './use-cases/send-windowed-notifications/send-windowed-notifications.use-case';
import { NotificationRepository } from './interface-adapters/gateways/notification-repository';
import { UserRepository } from './interface-adapters/gateways/user-repository';
import { TimeWindowRepository } from './interface-adapters/gateways/time-window-repository';
import { Cron } from './infra/cron/cron';
import { SendGridClient } from './infra/sendgrid/sendgrid-client';
import { SaveUserUseCase } from './use-cases/save-user/save-user.use-case';
import { Pino } from './infra/pino/pino';
import { Logger } from './domain/port-interfaces/logger.interface';
import { Container } from 'inversify';
import { BrokerConsumer } from './domain/port-interfaces/broker-consumer.interface';
import { CommandDispatcher } from './domain/port-interfaces/command-dispatcher.interface';
import { CommandMarker } from './domain/commands/command-marker.interface';
import { FileReader } from './domain/port-interfaces/file-reader.interface';
import { EmailSender } from './domain/port-interfaces/email-sender.interface';
import { TemplateCompiler } from './domain/port-interfaces/template-compiler.interface';
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
import { CronExecer } from './domain/port-interfaces/cron-execer';
import { commandHandlers } from './interface-adapters/controllers/command-handler.decorator';
import {
  commandHandlerDirPath,
  commandHandlerFileSuffix,
} from './interface-adapters/controllers/command-handler.constants';
import { DALMapper } from './interface-adapters/mappers/dal-mapper.interface';
import { GroupedNotificationRow } from './interface-adapters/gateways/grouped-notification-row';
import { Notification } from './domain/models/notification';
import { GroupedNotificationMapper } from './interface-adapters/mappers/grouped-notification-mapper';
import { NotificationRow } from './interface-adapters/gateways/notification-row';
import { NotificationMapper } from './interface-adapters/mappers/notification-mapper';
import { UserRow } from './interface-adapters/gateways/user-row';
import { User } from './domain/models/user';
import { UserMapper } from './interface-adapters/mappers/user-mapper';
import { TimeWindowMapper } from './interface-adapters/mappers/time-window-mapper';
import { TimeWindow } from './domain/models/time-window';
import { TimeWindowRow } from './interface-adapters/gateways/time-window-row';
import { Types } from './types';

const configComposer = new ConfigComposer();
configComposer.initialize();
const config = configComposer.composeConfig();
const container = new Container();

// LOGGER FIRST
container
  .bind<boolean>(Types.LoggerPrettify)
  .toConstantValue(process.env.NODE_ENV !== 'production');
container.bind<Logger>(Types.Logger).to(Pino).inSingletonScope();

// CONSTANTS
container
  .bind<string>(Types.EmailSenderAPIKey)
  .toConstantValue(config.emailSenderAPIKey);
container
  .bind<string>(Types.InstantNotificationTopic)
  .toConstantValue(config.instantNotificationTopic);
container
  .bind<string>(Types.WindowedNotificationsTopic)
  .toConstantValue(config.windowedNotificationTopic);
container.bind<string>(Types.UserTopic).toConstantValue(config.userTopic);
const kafka = new Kafka({
  clientId: config.kafkaClientID,
  brokers: [`${config.kafkaHost}:${config.kafkaPort}`],
  logCreator: () => {
    return ({ log }) => {
      const { message, ...extra } = log;
      container.get<Logger>(Types.Logger).info({
        message,
        extra,
      });
    };
  },
});
container
  .bind<Consumer>(Types.KafkaConsumer)
  .toConstantValue(kafka.consumer({ groupId: config.kafkaGroupId }));
container
  .bind<string>(Types.PostgresConnectionString)
  .toConstantValue(config.postgresConnectionString);
container
  .bind<string[]>(Types.DatabaseSchemas)
  .toConstantValue(config.databaseSchemas);
container
  .bind<ConfigTemplate[]>(Types.ConfigTemplates)
  .toConstantValue(config.templates);
container
  .bind<string>(Types.TemplateDirPath)
  .toConstantValue(path.join(__dirname, '..', config.templatePath));
container
  .bind<string>(Types.TemplateExtension)
  .toConstantValue(config.templateExtension);
container.bind<string>(Types.FromEmail).toConstantValue(config.fromEmail);
container
  .bind<string>(Types.CronExpression)
  .toConstantValue(config.sendWindowedNotificationsCronExpression);

// PRIMARY ACTORS
container.bind<BrokerConsumer>(Types.BrokerConsumer).to(KafkaJSConsumer);
container.bind<CronExecer>(Types.CronExecer).to(Cron);

// DRIVEN ACTORS
const commandBus = new CommandBus();
container
  .bind<CommandDispatcher<CommandMarker>>(Types.CommandDispatcher)
  .toConstantValue(commandBus);
container.bind<FileReader>(Types.FileReader).to(FSAsync);
container
  .bind<EmailSender>(Types.EmailSender)
  .to(SendGridClient)
  .inSingletonScope();
container.bind<TemplateCompiler>(Types.TemplateCompiler).to(HandlebarsCompiler);

// DAOs
const knexClient = new KnexClient(
  config.postgresConnectionString,
  config.databaseSchemas
);
container
  .bind<NotificationDAO>(Types.NotificationDAO)
  .toConstantValue(knexClient);
container.bind<UserDAO>(Types.UserDAO).toConstantValue(knexClient);
container.bind<TimeWindowDAO>(Types.TimeWindowDAO).toConstantValue(knexClient);

// MAPPERS
container
  .bind<DALMapper<Notification[], GroupedNotificationRow>>(
    Types.DALGroupedNotificationMapper
  )
  .to(GroupedNotificationMapper);
container
  .bind<DALMapper<Notification, NotificationRow>>(Types.DALNotificationMapper)
  .to(NotificationMapper);
container.bind<DALMapper<User, UserRow>>(Types.DALUserMapper).to(UserMapper);
container
  .bind<DALMapper<TimeWindow, TimeWindowRow>>(Types.DALTimeWindowMapper)
  .to(TimeWindowMapper);

// REPOSITORIES
container
  .bind<NotificationFetcher>(Types.NotificationFetcher)
  .to(NotificationRepository);
container
  .bind<NotificationCreator>(Types.NotificationCreator)
  .to(NotificationRepository);
container
  .bind<NotificationMutator>(Types.NotificationMutator)
  .to(NotificationRepository);
container.bind<UserSaver>(Types.UserSaver).to(UserRepository);
container.bind<UserFetcher>(Types.UserFetcher).to(UserRepository);
container
  .bind<TimeWindowCreator>(Types.TimeWindowCreator)
  .to(TimeWindowRepository);
container
  .bind<TimeWindowFetcher>(Types.TimeWindowFetcher)
  .to(TimeWindowRepository);

// USE CASES
container
  .bind<UseCaseExecutor<SaveUserPayload, Promise<void>>>(Types.SaveUserUseCase)
  .to(SaveUserUseCase);
container
  .bind<UseCaseExecutor<StoreWindowedNotificationPayload, Promise<void>>>(
    Types.StoreWindowedNotificationUseCase
  )
  .to(StoreWindowedNotificationUseCase);
container
  .bind<UseCaseExecutor<void, Promise<void>>>(
    Types.SendWindowedNotificationsUseCase
  )
  .to(SendWindowedNotificationsUseCase);
container
  .bind<UseCaseExecutor<SendEmailPayload, Promise<void>>>(
    Types.SendEmailUseCase
  )
  .to(SendEmailUseCase);

// BOOTSTRAP
// Import all command handlers
fs.readdirSync(`${commandHandlerDirPath}`)
  .filter((file) => file.includes(commandHandlerFileSuffix))
  .forEach((file) => {
    require(`${commandHandlerDirPath}/${file}`);
  });

// Register all imported command handlers
commandHandlers.forEach((ch) => {
  commandBus.registerDecorated(container.resolve(ch));
});

const cron = container.get<CronExecer>(Types.CronExecer);
cron.onTickSendWindowedNotifications();
cron.startNewCronJob();

const brokerConsumer = container.get<BrokerConsumer>(Types.BrokerConsumer);
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
