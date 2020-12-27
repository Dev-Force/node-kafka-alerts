export interface CronExecer {
  startNewCronJob(): void;
  onTickSendWindowedNotifications(): void;
}
