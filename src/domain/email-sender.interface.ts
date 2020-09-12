export interface EmailSender {
  sendEmail(
    from: string,
    to: string,
    subject: string,
    isHtml: boolean,
    compiledPayload: string
  ): Promise<boolean>;
}
