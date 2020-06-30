import { Logger } from '../logger';

const SilentLogger: Logger = {
  info: () => {},
  error: () => {},
  debug: () => {},
};
