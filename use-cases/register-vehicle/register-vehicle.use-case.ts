import { UseCaseExecutor } from '../use-case-executor.interface';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class RegisterVehicleUseCase implements UseCaseExecutor<any, any> {
  // TODO: inject repositoy using the constructor in order to insert a vehicle registered event in db.

  execute(test: string): any {
    console.log('inside execute RegisterVehicleUseCase');
    return `RegisterVehicleUseCase registered vehicle ${test}`;
  }
}
