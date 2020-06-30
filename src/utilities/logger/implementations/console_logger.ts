import { Logger, LogVerbosity } from '../logger';

const logger =
  typeof console != undefined && process.env.NODE_ENV === 'development'
    ? console
    : ({} as any);

export const ConsoleLogger = (verbosity: LogVerbosity): Logger => {
  const level = (function() {
    switch (verbosity) {
      case LogVerbosity.debug:
        return 0;
      case LogVerbosity.info:
        return 1;
      case LogVerbosity.error:
        return 2;
    }
  })();
  return {
    debug: (...args) => level === 0 && logger?.debug?.(...args),
    info: (...args) => level <= 1 && logger?.info?.(...args),
    error: (...args) => logger?.error?.(...args),
  };
};
