import * as pino from 'pino';
import { Logger } from '../../domain/port-interfaces/logger.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class Pino implements Logger {
  private pino: pino.Logger;

  constructor(@inject('LoggerPrettify') prettify: boolean) {
    const cfg = {
      prettyPrint: {
        levelFirst: true,
        suppressFlushSyncWarning: true,
      },
      prettifier: undefined,
    };

    if (prettify === true) {
      cfg.prettifier = require('pino-pretty');
    }

    this.pino = pino(cfg);
  }

  public info(value: Record<string, unknown>): void {
    this.pino.info(value);
  }

  public error(value: Record<string, unknown>): void {
    this.pino.error(value);
  }
}
