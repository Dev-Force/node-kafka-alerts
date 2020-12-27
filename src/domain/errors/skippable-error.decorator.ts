import { ERROR_METADATA_SKIPPABLE } from './error.constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export const SkippableError = (target: Function): void => {
  Reflect.defineMetadata(ERROR_METADATA_SKIPPABLE, true, target);
};

export function isSkippableError(e: Error): boolean {
  return Reflect.getMetadata(ERROR_METADATA_SKIPPABLE, e.constructor);
}
