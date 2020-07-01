export enum LogVerbosity {
  debug,
  info,
  error,
}

export interface Logger {
  info: (...args) => void;
  error: (...args) => void;
  debug: (...args) => void;
}
