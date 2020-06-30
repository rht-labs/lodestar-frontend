import { Logger } from '../logger';

const logger =
  typeof console != undefined && process.env.NODE_ENV === 'development'
    ? console
    : ({} as any);

export const ProductionConsoleLogger: Logger = {
  log: (...args) => {},
  info: (...args) => {},
  error: (...args) => logger?.error?.(...args),
  debug: (...args) => {},
};
