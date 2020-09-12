import 'reflect-metadata';

import * as fs from 'fs';
import * as hbs from 'handlebars';
import * as path from 'path';

import { CommandBus } from './infra/buses/command-bus';
import { SendEmailCommandHandler } from './interface-adapters/command-handlers/send-email.command-handler';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { DotEnv } from './infra/dotenv/dotenv';
import { SendGridClient } from './infra/sendgrid/sendgrid-client';
import { HandlebarsCompiler } from './infra/handlebars/handlebars-compiler';

import * as util from 'util';
const readFile = util.promisify(fs.readFile);
const promisifiedFs = { readFile };

const confGetter = new DotEnv();
confGetter.initialize();
const config = confGetter.getConfig();

const emailSender = new SendGridClient(config.getEmailSenderAPIKey());
const templateCompiler = new HandlebarsCompiler(hbs);

const registerVehicleUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender
);

// // INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new SendEmailCommandHandler(
  registerVehicleUseCase,
  promisifiedFs,
  path.join(__dirname, '..', config.getTemplatePath())
);
commandBus.registerDecorated(registerVehicleCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.configure();
expressApp.listen();

const notificationConsumer = new KafkaJSConsumer(
  config.getNotificationTopic(),
  config.getKafkaGroupId(),
  commandBus
);

notificationConsumer.consume();
