export interface CommandHandler {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handle: (cmd: object) => void;
}
