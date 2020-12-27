import { CronCommand, CronJob } from 'cron';
import { inject, injectable } from 'inversify';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { SendWindowedNotificationsCommand } from '../../domain/commands/send-windowed-notifications-command';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { CronExecer } from '../../domain/port-interfaces/cron-execer';

@injectable()
export class Cron implements CronExecer {
  private cronJob: CronJob;
  private onTick: () => void;

  constructor(
    @inject('CommandDispatcher')
    private commandBus: CommandDispatcher<CommandMarker>,
    @inject('CronExpression') private cronTime: string
  ) {}

  public startNewCronJob(): void {
    this.cronJob = new CronJob(this.cronTime, this.onTick as CronCommand);
    this.cronJob.start();
  }

  public onTickSendWindowedNotifications(): void {
    this.onTick = () => {
      this.commandBus.dispatch(new SendWindowedNotificationsCommand());
    };
  }
}
