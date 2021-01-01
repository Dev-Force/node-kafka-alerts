import { inject, injectable } from 'inversify';
import { TimeWindow } from '../../domain/models/time-window';
import { TimeWindowCreator } from '../../domain/port-interfaces/time-window-creator.interface';
import { TimeWindowFetcher } from '../../domain/port-interfaces/time-window-fetcher.interface';
import { DALMapper } from '../mappers/dal-mapper.interface';
import { TimeWindowDAO } from './time-window-dao.interface';
import { TimeWindowRow } from './time-window-row';

@injectable()
export class TimeWindowRepository
  implements TimeWindowCreator, TimeWindowFetcher {
  constructor(
    @inject('TimeWindowDAO') private timeWindowDAO: TimeWindowDAO,
    @inject('DALTimeWindowMapper')
    private timeWindowMapper: DALMapper<TimeWindow, TimeWindowRow>
  ) {}

  public async createNewTimeWindow(): Promise<void> {
    await this.timeWindowDAO.createNewTimeWindow();
  }

  public async getLatestTimeWindow(): Promise<TimeWindow> {
    return this.timeWindowMapper.fromDALEntityToDomain(
      await this.timeWindowDAO.getLatestTimeWindow()
    );
  }
}
