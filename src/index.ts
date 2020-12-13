import 'reflect-metadata';

import * as path from 'path';

import { Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { FSAsync } from './infra/fs-async/fs-async';
import { SendInstantNotificationCommandHandler } from './interface-adapters/controllers/send-instant-notification.command-handler';
import { KnexClient } from './infra/knex/knex-client';
import { StoreWindowedNotificationCommandHandler } from './interface-adapters/controllers/store-windowed-notification.command-handler';
import { StoreWindowedNotificationsUseCase } from './use-cases/store-windowed-notification/store-windowed-notification.use-case';
import { MockSendGridClient } from './infra/sendgrid/mock-sendgrid-client';
import { ConfigComposer } from './infra/config-composer/config-composer';
import { SendWindowedNotificationsUseCase } from './use-cases/send-windowed-notifications/send-windowed-notifications.use-case';
import { NotificationDataMapper } from './interface-adapters/gateways/notification-data-mapper';
import { UserDataMapper } from './interface-adapters/gateways/user-data-mapper';
import { TimeWindowDataMapper } from './interface-adapters/gateways/time-window-data-mapper';
import { Cron } from './infra/cron/cron';
import { SendWindowedNotificationsCommandHandler } from './interface-adapters/controllers/send-windowed-notifications.command-handler';

const fsAsync = new FSAsync();

const configComposer = new ConfigComposer();
configComposer.initialize();
const config = configComposer.composeConfig();

const emailSender = new MockSendGridClient(config.emailSenderAPIKey);
const templateCompiler = new HandlebarsCompiler();

// INIT BUS
const commandBus = new CommandBus();
const knexClient = new KnexClient(
  config.postgresConnectionString,
  config.databaseSchemas
);

// USE CASES
const sendEmailUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender,
  fsAsync
);
const storeWindowedNotificationsUseCase = new StoreWindowedNotificationsUseCase(
  new NotificationDataMapper(knexClient, config.templates),
  new UserDataMapper(knexClient)
);
const sendWindowedNotificationsUseCase = new SendWindowedNotificationsUseCase(
  new TimeWindowDataMapper(knexClient),
  new NotificationDataMapper(knexClient, config.templates),
  new NotificationDataMapper(knexClient, config.templates),
  commandBus
);

// COMMAND HANDLERS
const sendInstantNotificationCommandHandler = new SendInstantNotificationCommandHandler(
  sendEmailUseCase,
  new UserDataMapper(knexClient),
  path.join(__dirname, '..', config.templatePath),
  config.templateExtension,
  config.fromEmail,
  config.templates
);
const storeWindowedNotificationsCommandHandler = new StoreWindowedNotificationCommandHandler(
  storeWindowedNotificationsUseCase
);
const sendWindowedNotificationsCommandHandler = new SendWindowedNotificationsCommandHandler(
  sendWindowedNotificationsUseCase
);

commandBus.registerDecorated(sendInstantNotificationCommandHandler);
commandBus.registerDecorated(storeWindowedNotificationsCommandHandler);
commandBus.registerDecorated(sendWindowedNotificationsCommandHandler);

// Infra
const cron = new Cron(commandBus, '*/15 * * * *');
cron.onTickSendWindowedNotifications();
cron.startNewCronJob();

const expressApp = new ExpressServer(commandBus);
expressApp.init();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`${config.kafkaHost}:${config.kafkaPort}`],
});
const kafkaConsumer = new KafkaJSConsumer(
  config.instantNotificationTopic,
  config.windowedNotificationTopic,
  kafka.consumer({ groupId: config.kafkaGroupId }),
  commandBus
);
kafkaConsumer.consume();
