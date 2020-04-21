import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';
import Axios, { AxiosInstance } from 'axios';

export class PublicConfigService extends ConfigService {
  constructor({ axios = Axios.create() }: { axios?: AxiosInstance }) {
    super();
    this.axios = axios;
  }
  axios: AxiosInstance;
  async fetchConfig(): Promise<Config> {
    const { data } = await Axios.get(
      `${process.env.PUBLIC_URL}/config/config.json`
    );
    return Config.fromMap(data);
  }
}
