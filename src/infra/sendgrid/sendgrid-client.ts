import * as sendgrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';

export class SendGridClient implements EmailSender {
  constructor(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    isHtml: boolean,
    compiledPayload: string
  ): Promise<void> {
    const msg: MailDataRequired = {
      to,
      from,
      subject,
      html: undefined,
      text: undefined,
    };

    if (isHtml) {
      msg.html = compiledPayload;
    } else {
      msg.text = compiledPayload;
    }

    await sendgrid.send(msg);
  }
}
