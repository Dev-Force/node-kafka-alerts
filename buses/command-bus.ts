import { CommandHandler } from "../command-handlers/command-handler.interface";
import { CommandMarker } from "../commands/command.interface";
import { COMMAND_HANDLER_METADATA_COMMAND } from "../command-handlers/command-handler.constants";

export class CommandBus {

    private registryMap = {};

    register(className: string, handler: CommandHandler) {
        this.registryMap[className] = handler;
    }

    registerDecorated(handler: CommandHandler) {
        const commandClass = Reflect.getMetadata(COMMAND_HANDLER_METADATA_COMMAND, handler.constructor);
        if (commandClass == null) {
            throw Error(`Handler ${handler.constructor.name} is not decorated properly.`);
        }

        this.registryMap[commandClass.name] = handler;
    }

    dispatch(command: CommandMarker): void {
        const commandHandler = this.registryMap[command.constructor.name];
        if (commandHandler == null) {
            throw new Error('no handler available');
        }

        commandHandler.handle(command);
    }

}