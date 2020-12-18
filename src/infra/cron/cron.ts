import { CronCommand, CronJob } from 'cron';
import { CommandMarker } from '../../domain/commands/command-marker.interface';
import { SendWindowedNotificationsCommand } from '../../domain/commands/send-windowed-notifications-command';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';

export class Cron {
  private cronJob: CronJob;
  private onTick: () => void;

  constructor(
    private commandBus: CommandDispatcher<CommandMarker>,
    private cronTime: string
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
