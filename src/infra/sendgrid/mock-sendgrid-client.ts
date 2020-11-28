/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';

export class MockSendGridClient implements EmailSender {
  constructor(_apiKey: string) {
    console.log('sengrid apikey constructor');
  }

  async sendEmail(
    _from: string,
    _to: string,
    _subject: string,
    _isHtml: boolean,
    _compiledPayload: string
  ): Promise<void> {
    console.log('sending email');
  }
}
