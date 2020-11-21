import { ICommand } from './command.interface';

export class SendInstantEmailCommand implements ICommand {
  constructor(
    public from: string,
    public to: string,
    public subject: string,
    public isHTML: boolean,
    public template: string,
    public payload: Record<string, unknown>
  ) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.isHTML = isHTML;
    this.template = template;
    this.payload = payload;
  }
}
