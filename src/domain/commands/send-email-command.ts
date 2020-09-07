import { ICommand } from './command.interface';

export class SendEmailCommand implements ICommand {
  constructor(
    public from: string,
    public to: string,
    public template: string,
    public payload: Record<string, unknown>
  ) {
    this.from = from;
    this.to = to;
    this.template = template;
    this.payload = payload;
  }
}
