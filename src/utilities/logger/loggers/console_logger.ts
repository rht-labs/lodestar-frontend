import { Logger, LogVerbosity } from '../logger';

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
    debug: (...args) => level === 0 && console.debug?.(...args),
    info: (...args) => level <= 1 && console.info?.(...args),
    error: (...args) => console.error?.(...args),
  };
};
