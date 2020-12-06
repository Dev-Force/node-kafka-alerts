import { TimeWindow } from '../models/time-window';

// TODO: this should be implemented by an interface adapter and not by infra layer.
export interface TimeWindowRepository {
  getLatestTimeWindow(): Promise<TimeWindow>;
  createNewTimeWindow(): Promise<void>;
}
