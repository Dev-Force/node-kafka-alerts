import { ICommandHandler } from "./command-handler.interface";
import { RegisterVehicleCommand } from "../../domain/commands/register-vehicle-command";
import { CommandHandler } from "./command-handler.decorator";

@CommandHandler(RegisterVehicleCommand)
export class RegisterVehicleCommandHandler
  implements ICommandHandler<RegisterVehicleCommand> {
  handle(cmd: RegisterVehicleCommand): void {
    console.log(cmd.vin, cmd.color); // this should be printed.
  }
}
