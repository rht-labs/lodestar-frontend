import { Config } from '../../models/config';

export abstract class ConfigRepository {
  abstract async fetchConfig(): Promise<Config>;
}
