export interface CommandHandler<Command> {
  handle: (cmd: Command) => Promise<void>;
}
