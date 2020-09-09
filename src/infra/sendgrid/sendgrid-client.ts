import * as sendgrid from '@sendgrid/mail';
import { EmailSender } from '../../domain/email-sender.interface';

export class SendGridClient implements EmailSender {
  constructor(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  sendEmail(
    from: string,
    to: string,
    compiledPayload: string,
    isHtml: boolean
  ): Promise<boolean> {
    const msg: any = {
      to,
      from,
      subject: 'Sending with SendGrid is Fun',
    };

    if (isHtml) {
      msg.html = compiledPayload;
    } else {
      msg.text = compiledPayload;
    }

    return sendgrid.send(msg).then(() => true);
  }
}
