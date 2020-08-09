import "reflect-metadata";
import "./interface-adapters/command-handlers/command-handler.constants";

import { CommandBus } from "./infra/buses/command-bus";
import { RegisterVehicleCommandHandler } from "./interface-adapters/command-handlers/register-vehicle.command-handler";
import { ExpressServer } from "./infra/express/express-server";

// INIT BUS
const commandBus = new CommandBus();
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler();
commandBus.registerDecorated(registerVehicleCommandHandler);

const expressApp = new ExpressServer(commandBus);
expressApp.configure();
expressApp.listen();
