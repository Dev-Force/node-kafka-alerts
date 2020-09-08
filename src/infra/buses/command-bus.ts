import 'reflect-metadata';
import { ICommandHandler } from '../../interface-adapters/command-handlers/command-handler.interface';
import { ICommand } from '../../domain/commands/command.interface';
import { COMMAND_HANDLER_METADATA_COMMAND } from '../../interface-adapters/command-handlers/command-handler.constants';

export class CommandBus {
  private registryMap = {};

  register(className: string, handler: ICommandHandler<ICommand>): void {
    this.registryMap[className] = handler;
  }

  registerDecorated(handler: ICommandHandler<ICommand>): void {
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

  dispatch(command: ICommand): Promise<boolean> {
    const commandHandler = this.registryMap[command.constructor.name];
    if (commandHandler == null) {
      throw new Error('no handler available');
    }

    return commandHandler.handle(command);
  }
}
