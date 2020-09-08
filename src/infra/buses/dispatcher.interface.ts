export interface IDispatcher<Input> {
  dispatch(command: Input): Promise<boolean>;
}
