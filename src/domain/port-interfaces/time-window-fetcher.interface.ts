import { TimeWindow } from '../models/time-window';

export interface TimeWindowFetcher {
  getLatestTimeWindow(): Promise<TimeWindow>;
}
