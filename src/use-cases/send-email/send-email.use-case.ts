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
    const from = sendEmailPayload.from;
    const to = sendEmailPayload.to;
    const template = sendEmailPayload.template;
    const payload = sendEmailPayload.payload;

    console.log('compiling and sending email');
    const compiledPayload = this.templateCompiler.compile(template, payload);
    return this.emailSender.sendEmail(from, to, compiledPayload, true);
  }
}
