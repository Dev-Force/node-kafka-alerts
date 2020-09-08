import 'reflect-metadata';

import { CommandBus } from './infra/buses/command-bus';
import { SendEmailCommandHandler } from './interface-adapters/command-handlers/send-email.command-handler';
import { ExpressServer } from './infra/express/express-server';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';
import { KafkaJSConsumer } from './infra/kafkajs/kafkajs-consumer';
import { DotEnv } from './infra/dotenv/dotenv';

const confGetter = new DotEnv();
confGetter.initialize();
const config = confGetter.getConfig();

const emailSender = {
  sendEmail(
    from: string,
    to: string,
    compiledPayload: string,
    isHtml: boolean
  ): Promise<boolean> {
    console.log('sending email');
    return Promise.resolve(true);
  },
};
const templateCompiler = {
  compile(template: string, payload: Record<string, unknown>): string {
    console.log('compiling email');
    return 'hello';
  },
};

const registerVehicleUseCase = new SendEmailUseCase(
  templateCompiler,
  emailSender
);

// // INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new SendEmailCommandHandler(
  registerVehicleUseCase
);
commandBus.registerDecorated(registerVehicleCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.configure();
expressApp.listen();

const notificationConsumer = new KafkaJSConsumer(
  config.getNotificationTopic(),
  commandBus
);

notificationConsumer.consume();
