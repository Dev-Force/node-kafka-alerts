import { RetryableError } from './retryable-error.decorator';

@RetryableError
export class UniqueAggregateUUIDVersionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}
