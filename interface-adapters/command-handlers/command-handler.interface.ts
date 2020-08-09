export interface ICommandHandler<Command> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handle: (cmd: Command) => void;
}
