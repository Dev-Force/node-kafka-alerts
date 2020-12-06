import 'reflect-metadata';

import * as path from 'path';

import { Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { FSAsync } from './infra/fs-async/fs-async';
import { SendInstantNotificationCommandHandler } from './interface-adapters/command-handlers/send-instant-notification.command-handler';
import { KnexClient } from './infra/knex/knex-client';
import { StoreWindowedNotificationCommandHandler } from './interface-adapters/command-handlers/store-windowed-notification.command-handler';
import { StoreWindowedNotificationsUseCase } from './use-cases/store-windowed-notification/store-windowed-notification.use-case';
import { MockSendGridClient } from './infra/sendgrid/mock-sendgrid-client';
import { ConfigComposer } from './infra/config-composer/config-composer';
import { DatabaseGateway } from './interface-adapters/database/database-gateway';
import { SendWindowedNotificationsUseCase } from './use-cases/send-windowed-notifications/send-windowed-notifications.use-case';

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
  config.databaseSchemas,
  new DatabaseGateway(),
  new DatabaseGateway()
);

knexClient
  .getAllPendingNotifications()
  .then((res: any) => console.log('test', JSON.stringify(res, null, 2)))
  .catch((e) => console.log('test2', e));

const sendWindowedNotificationsUseCase = new SendWindowedNotificationsUseCase(
  knexClient,
  knexClient,
  commandBus
);
sendWindowedNotificationsUseCase.execute();

// USE CASES
const sendEmailUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender,
  fsAsync
);
const storeWindowedNotificationsUseCase = new StoreWindowedNotificationsUseCase(
  knexClient,
  knexClient
);

// COMMAND HANDLERS
const sendInstantNotificationCommandHandler = new SendInstantNotificationCommandHandler(
  sendEmailUseCase,
  knexClient,
  path.join(__dirname, '..', config.templatePath),
  config.templateExtension,
  config.fromEmail,
  config.templates
);
const storeWindowedNotificationsCommandHandler = new StoreWindowedNotificationCommandHandler(
  storeWindowedNotificationsUseCase
);

commandBus.registerDecorated(sendInstantNotificationCommandHandler);
commandBus.registerDecorated(storeWindowedNotificationsCommandHandler);

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
