import { injectable } from 'inversify';
import { TimeWindow } from '../../domain/models/time-window';
import { TimeWindowRow } from '../gateways/time-window-row';
import { DALMapper } from './dal-mapper.interface';

@injectable()
export class TimeWindowMapper implements DALMapper<TimeWindow, TimeWindowRow> {
  public fromDomainToDALEntity(timeWindow: TimeWindow): TimeWindowRow {
    throw new Error('Method not implemented.');
  }

  public fromDALEntityToDomain(timeWindowRow: TimeWindowRow): TimeWindow {
    return new TimeWindow(timeWindowRow.uuid);
  }
}
