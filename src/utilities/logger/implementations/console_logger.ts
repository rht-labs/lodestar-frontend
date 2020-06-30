import { Logger } from '../logger';

const logger =
  typeof console != undefined && process.env.NODE_ENV === 'development'
    ? console
    : ({} as any);

export const ConsoleLogger: Logger = {
  log: (...args) => logger?.log?.(...args),
  info: (...args) => logger?.info?.(...args),
  error: (...args) => logger?.error?.(...args),
  debug: (...args) => logger?.debug?.(...args),
};
