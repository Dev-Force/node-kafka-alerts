import { inject, injectable } from 'inversify';
import { TimeWindow } from '../../domain/models/time-window';
import { TimeWindowCreator } from '../../domain/port-interfaces/time-window-creator.interface';
import { TimeWindowFetcher } from '../../domain/port-interfaces/time-window-fetcher.interface';
import { TimeWindowDAO } from './time-window-dao.interface';
import { TimeWindowRow } from './time-window-row';

@injectable()
export class TimeWindowDataMapper
  implements TimeWindowCreator, TimeWindowFetcher {
  constructor(@inject('TimeWindowDAO') private timeWindowDAO: TimeWindowDAO) {}

  public async createNewTimeWindow(): Promise<void> {
    await this.timeWindowDAO.createNewTimeWindow();
  }

  public async getLatestTimeWindow(): Promise<TimeWindow> {
    return this.toDomainTimeWindow(
      await this.timeWindowDAO.getLatestTimeWindow()
    );
  }

  private toDomainTimeWindow(timeWindowRow: TimeWindowRow): TimeWindow {
    return new TimeWindow(timeWindowRow.uuid);
  }
}
