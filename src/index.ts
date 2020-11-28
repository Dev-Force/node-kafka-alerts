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

const fsAsync = new FSAsync();

const configComposer = new ConfigComposer();
configComposer.initialize();
const config = configComposer.composeConfig();

const emailSender = new MockSendGridClient(config.emailSenderAPIKey);
const templateCompiler = new HandlebarsCompiler();

// INIT BUS
const commandBus = new CommandBus();
const knexClient = new KnexClient(config.postgresConnectionString);

// USE CASES
const sendEmailUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender,
  fsAsync
);
const storeWindowedNotificationsUseCase = new StoreWindowedNotificationsUseCase(
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
const instantNotificationConsumer = new KafkaJSConsumer(
  config.instantNotificationTopic,
  kafka.consumer({ groupId: config.kafkaGroupId }),
  commandBus
);
instantNotificationConsumer.consumeInstantNotifications();

// const windowedNotificationConsumer = new KafkaJSConsumer(
//   config.windowedNotificationTopic,
//   kafka.consumer({ groupId: config.kafkaGroupId }),
//   commandBus
// );
// windowedNotificationConsumer.consumeWindowedNotifications();
