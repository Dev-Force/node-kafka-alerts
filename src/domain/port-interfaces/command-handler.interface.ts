export interface ICommandHandler<Command> {
  handle: (cmd: Command) => Promise<void>;
}
