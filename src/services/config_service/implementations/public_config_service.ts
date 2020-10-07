import { ConfigService } from '../config_service';
import { Config } from '../../../schemas/config';
import Axios from 'axios';
import { Serializer } from '../../../serializers/serializer';
import { ConfigJsonSerializer } from '../../../serializers/config/config_json_serializer';

export class PublicConfigService extends ConfigService {
  constructor(
    private serializer: Serializer<Config, object> = new ConfigJsonSerializer()
  ) {
    super();
  }
  async fetchConfig(): Promise<Config> {
    const { data } = await Axios.get(
      `${process.env.PUBLIC_URL}/config/config.json?t=${new Date().getTime()}`
    );
    return this.serializer.deserialize(data);
  }
}
