import { SkippableError } from './skippable-error.decorator';

@SkippableError
export class UniqueInstantAggregateUUIDVersionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    Error.captureStackTrace(this, new.target);
  }
}
