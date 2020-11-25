import 'reflect-metadata';

import * as path from 'path';

import { Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { DotEnv } from './infra/dotenv/dotenv';
import { SendGridClient } from './infra/sendgrid/sendgrid-client';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { FSAsync } from './infra/fs-async/fs-async';
import { SendInstantNotificationCommandHandler } from './interface-adapters/command-handlers/send-instant-notification.command-handler';
import * as config from 'config';
import { KnexClient } from './infra/knex/knex-client';
import { ConfigTemplate } from './domain/models/config-template';
import { StoreWindowedNotificationCommandHandler } from './interface-adapters/command-handlers/store-windowed-notification.command-handler';
import { StoreWindowedNotificationsUseCase } from './use-cases/store-windowed-notification/store-windowed-notification.use-case';

const fsAsync = new FSAsync();

const envGetter = new DotEnv();
envGetter.initialize();
const dotEnvConf = envGetter.getConfig();

const emailSender = new SendGridClient(dotEnvConf.getEmailSenderAPIKey());
const templateCompiler = new HandlebarsCompiler();

// INIT BUS
const commandBus = new CommandBus();
const knexClient = new KnexClient(
  envGetter.getConfig().getPostgresConnectionString()
);

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
  path.join(__dirname, '..', dotEnvConf.getTemplatePath()),
  config.get<string>('template-extension'),
  config.get<string>('from-email'),
  config.get<ConfigTemplate[]>('templates')
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
  brokers: [`${dotEnvConf.getKafkaHost()}:${dotEnvConf.getKafkaPort()}`],
});
const instantNotificationConsumer = new KafkaJSConsumer(
  dotEnvConf.getInstantNotificationTopic(),
  kafka.consumer({ groupId: dotEnvConf.getKafkaGroupId() }),
  commandBus
);
instantNotificationConsumer.consumeInstantNotifications();

// const windowedNotificationConsumer = new KafkaJSConsumer(
//   dotEnvConf.getWindowedNotificationTopic(),
//   kafka.consumer({ groupId: dotEnvConf.getKafkaGroupId() }),
//   commandBus
// );
// windowedNotificationConsumer.consumeWindowedNotifications();
