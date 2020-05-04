import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';
import Axios from 'axios';

export class PublicConfigService extends ConfigService {
  async fetchConfig(): Promise<Config> {
    const { data } = await Axios.get(
      `${process.env.PUBLIC_URL}/config/config.json`
    );
    return Config.fromMap(data);
  }
}
