import { Logger } from '../logger';

const SilentLogger: Logger = {
  log: () => {},
  info: () => {},
  error: () => {},
  debug: () => {},
};
