import 'reflect-metadata';
import './interface-adapters/command-handlers/command-handler.constants';

import { CommandBus } from './infra/buses/command-bus';
import { RegisterVehicleCommandHandler } from './interface-adapters/command-handlers/register-vehicle.command-handler';
import { ExpressServer } from './infra/express/express-server';
import { RegisterVehicleUseCase } from './use-cases/register-vehicle/register-vehicle.use-case';

const registerVehicleUseCase = new RegisterVehicleUseCase();

// INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler(
  registerVehicleUseCase
);
commandBus.registerDecorated(registerVehicleCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.configure();
expressApp.listen();
