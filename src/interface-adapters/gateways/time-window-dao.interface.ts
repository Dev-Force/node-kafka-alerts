import { TimeWindowRow } from './time-window-row';

export interface TimeWindowDAO {
  getLatestTimeWindow(): Promise<TimeWindowRow>;
  createNewTimeWindow(): Promise<void>;
}
