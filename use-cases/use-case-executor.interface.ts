interface UseCaseExecutor<Input, Output> {
  execute(input: Input): Output;
}
