import { ConfigRepository } from '../config_repository';
import { Config } from '../../../models/config';
import Axios, { AxiosInstance } from 'axios';

export class PublicConfigRepository extends ConfigRepository {
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
