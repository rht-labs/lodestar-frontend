export interface Logger {
  log: (...args) => void;
  info: (...args) => void;
  error: (...args) => void;
}

const logger =
  typeof console != undefined && process.env.NODE_ENV === 'development'
    ? console
    : ({} as any);

export const Logger: Logger = {
  log: (...args) => logger?.log?.(args),
  info: (...args) => logger?.info?.(args),
  error: (...args) => logger?.error?.(args),
};
