export interface CommandDispatcher<Input> {
  dispatch(command: Input): Promise<boolean>;
}
