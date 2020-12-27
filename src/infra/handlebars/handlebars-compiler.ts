import * as hbs from 'handlebars';
import { injectable } from 'inversify';
import { Compiler } from '../../domain/port-interfaces/compiler.interface';

@injectable()
export class HandlebarsCompiler implements Compiler {
  compile(template: string, payload: Record<string, unknown>): string {
    const hbsTemplate = hbs.compile(template);
    return hbsTemplate(payload);
  }
}
