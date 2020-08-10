export interface ICommandHandler<Command> {
  handle: (cmd: Command) => void;
}
