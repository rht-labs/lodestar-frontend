export interface Logger {
  log: (...args) => void;
  info: (...args) => void;
  error: (...args) => void;
  debug: (...args) => void;
}
