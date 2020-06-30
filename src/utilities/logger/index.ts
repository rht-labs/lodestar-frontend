import { Logger as LoggerContract } from './logger';
import { ConsoleLogger } from './implementations/console_logger';
import { ProductionConsoleLogger } from './implementations/production_console_logger';

export const Logger: LoggerContract =
  process.env.NODE_ENV === 'production'
    ? ProductionConsoleLogger
    : ConsoleLogger;
