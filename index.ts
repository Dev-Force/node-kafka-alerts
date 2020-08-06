// Keep these for reflect.
import 'reflect-metadata';
import './command-handlers/command-handler.constants';

import { CommandBus } from "./buses/command-bus";
import { RegisterVehicleCommandHandler } from "./command-handlers/register-vehicle-command-handler";
import { RegisterVehicleCommand } from "./commands/register-vehicle-command";

// INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler();
commandBus.registerDecorated(registerVehicleCommandHandler);

// EXECUTE COMMAND
const cmd = new RegisterVehicleCommand();
cmd.name = 'this should be printed';
commandBus.dispatch(cmd);

// import './command-handlers/register-vehicle-command-handler'; 