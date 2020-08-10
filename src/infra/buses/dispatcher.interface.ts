export interface IDispatcher<Input> {
  dispatch(command: Input): void;
}
