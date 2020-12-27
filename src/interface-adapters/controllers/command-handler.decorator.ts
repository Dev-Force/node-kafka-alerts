import { COMMAND_HANDLER_METADATA_COMMAND } from './command-handler.constants';
import { AnyClass } from '../../domain/any-class-type';

export const CommandHandler = (command: AnyClass): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA_COMMAND, command, target);
  };
};
