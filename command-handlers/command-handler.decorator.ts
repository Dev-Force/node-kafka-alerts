import { COMMAND_HANDLER_METADATA_COMMAND } from './command-handler.constants';
import { AnyClass } from '../types/any-class';

export const HandlesCommand = (command: AnyClass): ClassDecorator => {
    return (target: object) => {
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA_COMMAND, command, target);
    };
};
  