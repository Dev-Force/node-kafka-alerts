import * as sendgrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import { inject, injectable } from 'inversify';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';

@injectable()
export class SendGridClient implements EmailSender {
  constructor(@inject('EmailSenderAPIKey') apiKey: string) {
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
