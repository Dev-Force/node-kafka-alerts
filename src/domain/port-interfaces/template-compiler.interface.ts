export interface TemplateCompiler {
  compile(template: string, payload: Record<string, unknown>): string;
}
