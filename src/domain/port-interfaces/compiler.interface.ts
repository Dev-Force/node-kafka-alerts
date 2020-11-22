export interface Compiler {
  compile(template: string, payload: Record<string, unknown>): string;
}
