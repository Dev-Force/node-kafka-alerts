export class SendEmailPayload {
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

  toJSON(): Record<string, unknown> {
    return {
      from: this.from,
      to: this.to,
      subject: this.subject,
      isHTML: this.isHTML,
      template: this.template,
      payload: this.payload,
    };
  }
}
