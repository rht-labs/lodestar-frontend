import { Config } from '../../schemas/config';

export abstract class ConfigService {
  abstract async fetchConfig(): Promise<Config>;
}
