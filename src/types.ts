export const Types = {
  CommandDispatcher: Symbol.for('CommandDispatcher'),
  CronExpression: Symbol.for('CronExpression'),
  CronExecer: Symbol.for('CronExecer'),
  FromEmail: Symbol.for('FromEmail'),
  EmailSenderAPIKey: Symbol.for('EmailSenderAPIKey'),
  EmailSender: Symbol.for('EmailSender'),
  TemplateDirPath: Symbol.for('TemplateDirPath'),
  TemplateExtension: Symbol.for('TemplateExtension'),
  ConfigTemplates: Symbol.for('ConfigTemplates'),
  PostgresConnectionString: Symbol.for('PostgresConnectionString'),
  DatabaseSchemas: Symbol.for('DatabaseSchemas'),

  KafkaConsumer: Symbol.for('KafkaConsumer'),
  BrokerConsumer: Symbol.for('BrokerConsumer'),
  InstantNotificationTopic: Symbol.for('InstantNotificationTopic'),
  WindowedNotificationsTopic: Symbol.for('WindowedNotificationsTopic'),
  UserTopic: Symbol.for('UserTopic'),

  TemplateCompiler: Symbol.for('TemplateCompiler'),
  FileReader: Symbol.for('FileReader'),

  Logger: Symbol.for('Logger'),
  LoggerPrettify: Symbol.for('LoggerPrettify'),

  SaveUserUseCase: Symbol.for('SaveUserUseCase'),
  SendEmailUseCase: Symbol.for('SendEmailUseCase'),
  SendWindowedNotificationsUseCase: Symbol.for(
    'SendWindowedNotificationsUseCase'
  ),
  StoreWindowedNotificationUseCase: Symbol.for(
    'StoreWindowedNotificationUseCase'
  ),

  NotificationFetcher: Symbol.for('NotificationFetcher'),
  NotificationCreator: Symbol.for('NotificationCreator'),
  NotificationMutator: Symbol.for('NotificationMutator'),
  DALNotificationMapper: Symbol.for('DALNotificationMapper'),
  DALGroupedNotificationMapper: Symbol.for('DALGroupedNotificationMapper'),
  NotificationDAO: Symbol.for('NotificationDAO'),

  TimeWindowFetcher: Symbol.for('TimeWindowFetcher'),
  TimeWindowCreator: Symbol.for('TimeWindowCreator'),
  DALTimeWindowMapper: Symbol.for('DALTimeWindowMapper'),
  TimeWindowDAO: Symbol.for('TimeWindowDAO'),

  UserSaver: Symbol.for('UserSaver'),
  UserFetcher: Symbol.for('UserFetcher'),
  DALUserMapper: Symbol.for('DALUserMapper'),
  UserDAO: Symbol.for('UserDAO'),

  SendInstantNotificationCommandHandler: Symbol.for(
    'SendInstantNotificationCommandHandler'
  ),
  StoreWindowedNotificationCommandHandler: Symbol.for(
    'StoreWindowedNotificationCommandHandler'
  ),
  SendWindowedNotificationsCommandHandler: Symbol.for(
    'SendWindowedNotificationsCommandHandler'
  ),
  SaveUserCommandHandler: Symbol.for('SaveUserCommandHandler'),
};
