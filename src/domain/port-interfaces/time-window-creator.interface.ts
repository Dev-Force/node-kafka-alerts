export interface TimeWindowCreator {
  createNewTimeWindow(): Promise<void>;
}
