import { CommandHandler } from "./command-handler.interface";
import { RegisterVehicleCommand } from "../../domain/commands/register-vehicle-command";
import { HandlesCommand } from "./command-handler.decorator";

@HandlesCommand(RegisterVehicleCommand)
export class RegisterVehicleCommandHandler implements CommandHandler {
  handle(cmd: RegisterVehicleCommand): void {
    console.log(cmd.name); // this should be printed.
  }
}
