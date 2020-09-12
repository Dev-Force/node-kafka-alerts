import { UseCaseExecutor } from '../use-case-executor.interface';
import { Compiler } from '../../domain/compiler.interface';
import { EmailSender } from '../../domain/email-sender.interface';
import { SendEmailPayload } from '../../domain/send-email-payload';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class SendEmailUseCase
  implements UseCaseExecutor<SendEmailPayload, Promise<boolean>> {
  constructor(
    private templateCompiler: Compiler,
    private emailSender: EmailSender
  ) {}

  execute(sendEmailPayload: SendEmailPayload): Promise<boolean> {
    const { from, to, subject, isHTML, template, payload } = sendEmailPayload;

    console.log('compiling and sending email');
    const compiledPayload = this.templateCompiler.compile(template, payload);
    return this.emailSender.sendEmail(
      from,
      to,
      subject,
      isHTML,
      compiledPayload
    );
  }
}
