// Keep these for reflect.
import 'reflect-metadata';
import './interface-adapters/command-handlers/command-handler.constants';

import { CommandBus } from "./infra/buses/command-bus";
import { RegisterVehicleCommandHandler } from "./interface-adapters/command-handlers/register-vehicle-command-handler";
import { RegisterVehicleCommand } from "./domain/commands/register-vehicle-command";

// INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler();
commandBus.registerDecorated(registerVehicleCommandHandler);

// EXECUTE COMMAND
const cmd = new RegisterVehicleCommand();
cmd.name = 'this should be printed';
commandBus.dispatch(cmd);
