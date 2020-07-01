import { Logger as LoggerContract, LogVerbosity } from './logger';
import { ConsoleLogger, SilentLogger } from './loggers';

const LOGGERS = {
  silent: SilentLogger,
  console: ConsoleLogger,
};

export const Logger: LoggerContract = (function(): LoggerContract {
  const envLogger = process.env.REACT_APP_LOGGER ?? '';
  if (envLogger in LOGGERS) {
    return LOGGERS[envLogger];
  } else if (process.env.NODE_ENV === 'production') {
    return ConsoleLogger(LogVerbosity.error);
  } else {
    return ConsoleLogger(LogVerbosity.debug);
  }
})();
