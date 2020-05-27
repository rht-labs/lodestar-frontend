import { Apiv1EngagementService } from './apiv1_engagement_service';
import Axios from 'axios';
import {
  EngagementFormConfig,
  EngagementFormValidator,
} from '../../../schemas/engagement_config';

export class NewConfigEngagementService extends Apiv1EngagementService {
  constructor(baseURL: string, onBeforeRequest, onAfterRequest, onFailure) {
    super(baseURL, onBeforeRequest, onAfterRequest, onFailure);
  }
  async getConfig(): Promise<EngagementFormConfig> {
    const { data } = await Axios.get(
      `${process.env.PUBLIC_URL}/config/example-schema.json`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept-version': 'v2',
          Accept: 'application/json',
        },
      }
    );
    console.info(JSON.stringify(data, null, 2));
    return data;
  }
}
