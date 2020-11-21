import * as hbs from 'handlebars';
import { Compiler } from '../../domain/compiler.interface';

export class HandlebarsCompiler implements Compiler {
  compile(template: string, payload: Record<string, unknown>): string {
    const hbsTemplate = hbs.compile(template);
    return hbsTemplate(payload);
  }
}
