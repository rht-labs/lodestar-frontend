import { Logger as LoggerContract, LogVerbosity } from './logger';
import { ConsoleLogger } from './implementations/console_logger';

export const Logger: LoggerContract =
  process.env.NODE_ENV === 'production'
    ? ConsoleLogger(LogVerbosity.error)
    : ConsoleLogger(LogVerbosity.debug);
