import { ERROR_METADATA_RETRYABLE } from './error.constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export const RetryableError = (target: Function): void => {
  Reflect.defineMetadata(ERROR_METADATA_RETRYABLE, true, target);
};

export function isRetryableError(e: Error): boolean {
  return Reflect.getMetadata(ERROR_METADATA_RETRYABLE, e.constructor);
}
