export class SendEmailPayload {
  constructor(
    public from: string,
    public to: string,
    public subject: string,
    public isHTML: boolean,
    public templatePath: string,
    public payload: Record<string, unknown>
  ) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.isHTML = isHTML;
    this.templatePath = templatePath;
    this.payload = payload;
  }
}
