import { Compiler } from '../../domain/compiler.interface';

export class HandlebarsCompiler implements Compiler {
  constructor(private hbsLib: any) {
    this.hbsLib = hbsLib;
  }

  compile(template: string, payload: Record<string, unknown>): string {
    const hbsTemplate = this.hbsLib.compile(template);
    return hbsTemplate(payload);
  }
}
