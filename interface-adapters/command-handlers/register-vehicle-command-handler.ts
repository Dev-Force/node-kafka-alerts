import { CommandHandler } from "./command-handler.interface";
import { RegisterVehicleCommand } from "../../domain/commands/register-vehicle-command";
import { HandlesCommand } from "../../infra/command-handler.decorator";

@HandlesCommand(RegisterVehicleCommand)
export class RegisterVehicleCommandHandler implements CommandHandler {

    handle(cmd: RegisterVehicleCommand) {
        console.log(cmd.name); // this should be printed.
    }

}
