export interface Logger {
  info(value: Record<string, unknown>): void;
  error(value: Record<string, unknown>): void;
}
