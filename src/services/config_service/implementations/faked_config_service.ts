import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';

export class FakedConfigService extends ConfigService {
  async fetchConfig(): Promise<Config> {
    return Config.fromFake();
  }
}
