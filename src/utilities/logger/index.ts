import { Logger as LoggerContract, LogVerbosity } from './logger';
import { ConsoleLogger, SilentLogger } from './loggers';

const LOGGERS = (logVerbosity: LogVerbosity) => ({
  silent: SilentLogger,
  console: ConsoleLogger(logVerbosity),
});

const ENV_LOG_VERBOSITY: LogVerbosity = (function() {
  const envVerbosityLevel = process.env.REACT_APP_LOG_VERBOSITY;
  switch (envVerbosityLevel) {
    case 'error':
      return LogVerbosity.error;
    case 'info':
      return LogVerbosity.info;
    case 'debug':
      return LogVerbosity.debug;
    default:
      return LogVerbosity.error;
  }
})();

export const Logger: LoggerContract = (function(): LoggerContract {
  const envLogger = process.env.REACT_APP_LOGGER ?? '';
  const loggers = LOGGERS(ENV_LOG_VERBOSITY);
  if (envLogger in loggers) {
    return loggers[envLogger];
  } else if (process.env.NODE_ENV === 'production') {
    return loggers.console;
  } else {
    return loggers.console;
  }
})();
