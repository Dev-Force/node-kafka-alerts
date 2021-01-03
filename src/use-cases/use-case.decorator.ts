import { USE_CASE_METADATA_SYMBOL } from './use-case.constants';

export const useCaseRegistry = [];

export const UseCase = (useCase: symbol): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    useCaseRegistry.push(target);
    Reflect.defineMetadata(USE_CASE_METADATA_SYMBOL, useCase, target);
  };
};
