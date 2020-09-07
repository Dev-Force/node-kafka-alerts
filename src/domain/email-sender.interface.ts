export interface EmailSender {
  sendEmail(
    from: string,
    to: string,
    compiledPayload: string,
    isHtml: boolean
  ): Promise<boolean>;
}
