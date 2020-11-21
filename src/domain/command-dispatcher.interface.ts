export interface ICommandDispatcher<Input> {
  dispatch(command: Input): Promise<boolean>;
}
