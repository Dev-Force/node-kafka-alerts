import "reflect-metadata";
import { COMMAND_HANDLER_METADATA_COMMAND } from "../../interface-adapters/command-handlers/command-handler.constants";
import { AnyClass } from "../../domain/any-class-type";

export const HandlesCommand = (command: AnyClass): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA_COMMAND, command, target);
  };
};
