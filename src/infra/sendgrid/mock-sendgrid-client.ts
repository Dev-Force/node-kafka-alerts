/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { inject, injectable } from 'inversify';
import { EmailSender } from '../../domain/port-interfaces/email-sender.interface';
import { Logger } from '../../domain/port-interfaces/logger.interface';

@injectable()
export class MockSendGridClient implements EmailSender {
  constructor(@inject('Logger') private logger: Logger) {}

  async sendEmail(
    _from: string,
    _to: string,
    _subject: string,
    _isHtml: boolean,
    _compiledPayload: string
  ): Promise<void> {
    this.logger.info({ message: 'sending email' });
  }
}
