import { SkippableError } from './skippable-error.decorator';

@SkippableError
export class UniqueTimeWindowNotificationError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}
