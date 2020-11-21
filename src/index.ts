import 'reflect-metadata';

import * as path from 'path';

import { Kafka } from 'kafkajs';

import { CommandBus } from './infra/buses/command-bus';
import { SendInstantEmailCommandHandler } from './infra/buses/command-handlers/send-email.command-handler';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { DotEnv } from './infra/dotenv/dotenv';
import { SendGridClient } from './infra/sendgrid/sendgrid-client';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';
import { MessagingAdapter } from './interface-adapters/messaging/messaging-adapter';
import { FSAsync } from './infra/fs-async/fs-async';

const fsAsync = new FSAsync();

const confGetter = new DotEnv();
confGetter.initialize();
const config = confGetter.getConfig();

const emailSender = new SendGridClient(config.getEmailSenderAPIKey());
const templateCompiler = new HandlebarsCompiler();

const sendEmailUseCase = new SendEmailUseCase(templateCompiler, emailSender);

// INIT BUS
const commandBus = new CommandBus();
const sendInstantEmailCommandHandler = new SendInstantEmailCommandHandler(
  sendEmailUseCase,
  fsAsync,
  path.join(__dirname, '..', config.getTemplatePath())
);
commandBus.registerDecorated(sendInstantEmailCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.init();

const messagingAdapter = new MessagingAdapter();
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`${config.getKakfaHost}:${config.getKakfaPort()}`],
});
const instantNotificationConsumer = new KafkaJSConsumer(
  config.getInstantNotificationTopic(),
  kafka.consumer({ groupId: config.getKafkaGroupId() }),
  commandBus,
  messagingAdapter
);
instantNotificationConsumer.consumeInstantNotifications();

const windowedNotificationConsumer = new KafkaJSConsumer(
  config.getWindowedNotificationTopic(),
  kafka.consumer({ groupId: config.getKafkaGroupId() }),
  commandBus,
  messagingAdapter
);
windowedNotificationConsumer.consumeWindowedNotifications();
