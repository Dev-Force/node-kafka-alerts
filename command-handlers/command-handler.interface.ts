export interface CommandHandler {
    handle: (cmd: object) => void
}