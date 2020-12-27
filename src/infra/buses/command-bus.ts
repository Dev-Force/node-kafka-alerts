import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { COMMAND_HANDLER_METADATA_COMMAND } from '../../interface-adapters/controllers/command-handler.constants';
import { injectable } from 'inversify';

@injectable()
export class CommandBus {
  private registryMap = {};

  register(className: string, handler: ICommandHandler<CommandMarker>): void {
    this.registryMap[className] = handler;
  }

  registerDecorated(handler: ICommandHandler<CommandMarker>): void {
    const commandClass = Reflect.getMetadata(
      COMMAND_HANDLER_METADATA_COMMAND,
      handler.constructor
    );
    if (commandClass == null) {
      throw Error(
        `Handler ${handler.constructor.name} is not decorated properly.`
      );
    }

    const commandClassName = commandClass.name;
    if (this.registryMap[commandClassName] != null) {
      throw Error(
        `Handler for ${commandClassName} command is already registered.`
      );
    }

    this.registryMap[commandClassName] = handler;
  }

  dispatch(command: CommandMarker): Promise<boolean> {
    const commandHandler = this.registryMap[command.constructor.name];
    if (commandHandler == null) {
      throw new Error('no handler available');
    }

    return commandHandler.handle(command);
  }
}
