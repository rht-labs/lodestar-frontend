import { Logger } from '../logger';

export const SilentLogger: Logger = {
  info: () => {},
  error: () => {},
  debug: () => {},
};
