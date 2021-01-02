import * as hbs from 'handlebars';
import { injectable } from 'inversify';
import { TemplateCompiler } from '../../domain/port-interfaces/template-compiler.interface';

@injectable()
export class HandlebarsCompiler implements TemplateCompiler {
  compile(template: string, payload: Record<string, unknown>): string {
    const hbsTemplate = hbs.compile(template);
    return hbsTemplate(payload);
  }
}
