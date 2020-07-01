import { Logger as LoggerContract, LogVerbosity } from './logger';
import { ConsoleLogger, SilentLogger } from './loggers';

const LOGGERS = (logVerbosity: LogVerbosity) => ({
  silent: SilentLogger,
  console: ConsoleLogger(logVerbosity),
});

export const getLogVerbosityFromString = (verbosity: string): LogVerbosity => {
  switch (verbosity) {
    case 'error':
      return LogVerbosity.error;
    case 'info':
      return LogVerbosity.info;
    case 'debug':
      return LogVerbosity.debug;
    default:
      return LogVerbosity.error;
  }
};

export function createLogger(
  loggerType: string = '',
  logVerbosity: LogVerbosity
) {
  const loggers = LOGGERS(logVerbosity);
  if (loggerType in loggers) {
    return loggers[loggerType];
  } else if (process.env.NODE_ENV === 'production') {
    return loggers.console;
  } else {
    return loggers.console;
  }
}

export class Logger {
  private static _instance: LoggerContract;
  static get instance() {
    if (!Logger._instance) {
      Logger._instance = createLogger(
        process.env.REACT_APP_LOGGER ?? '',
        getLogVerbosityFromString(process.env.REACT_APP_LOG_VERBOSITY)
      );
    }
    return Logger._instance;
  }
  static set instance(logger: LoggerContract) {
    Logger._instance = logger;
  }
}
