export interface JsonMessageHandler {
  handle: (name: Record<string, unknown>) => void;
}
