export class SendEmailPayload {
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

  toJSON(): Record<string, unknown> {
    return {
      from: this.from,
      to: this.to,
      template: this.template,
      payload: this.payload,
    };
  }
}
