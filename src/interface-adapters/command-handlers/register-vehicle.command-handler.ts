import { ICommandHandler } from './command-handler.interface';
import { RegisterVehicleCommand } from '../../domain/commands/register-vehicle-command';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';

@CommandHandler(RegisterVehicleCommand)
export class RegisterVehicleCommandHandler
  implements ICommandHandler<RegisterVehicleCommand> {
  constructor(private usecase: UseCaseExecutor<string, string>) {
    this.usecase = usecase;
  }

  handle(cmd: RegisterVehicleCommand): void {
    const result: string = this.usecase.execute('usecase param');
    console.log(cmd.vin, cmd.color); // this should be printed.
    console.log(result);
  }
}
