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

const fsAsync = new FSAsync();

const confGetter = new DotEnv();
confGetter.initialize();
const dotEnvConf = confGetter.getConfig();

const emailSender = new SendGridClient(dotEnvConf.getEmailSenderAPIKey());
const templateCompiler = new HandlebarsCompiler();

const sendEmailUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender,
  fsAsync
);

// INIT BUS
const commandBus = new CommandBus();
const sendInstantNotificationCommandHandler = new SendInstantNotificationCommandHandler(
  sendEmailUseCase,
  path.join(__dirname, '..', dotEnvConf.getTemplatePath()),
  config.get('template-extension')
);
commandBus.registerDecorated(sendInstantNotificationCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.init();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`${dotEnvConf.getKakfaHost}:${dotEnvConf.getKakfaPort()}`],
});
const instantNotificationConsumer = new KafkaJSConsumer(
  dotEnvConf.getInstantNotificationTopic(),
  kafka.consumer({ groupId: dotEnvConf.getKafkaGroupId() }),
  commandBus
);
instantNotificationConsumer.consumeInstantNotifications();

const windowedNotificationConsumer = new KafkaJSConsumer(
  dotEnvConf.getWindowedNotificationTopic(),
  kafka.consumer({ groupId: dotEnvConf.getKafkaGroupId() }),
  commandBus
);
windowedNotificationConsumer.consumeWindowedNotifications();
