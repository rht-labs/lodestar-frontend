import { EngagementService } from '../../engagement_service';
import { Engagement } from '../../../../schemas/engagement_schema';
import FakedSchema from './faked_schema.json';
import { EngagementFormConfig } from '../../../../schemas/engagement_config';

export class FakedEngagementService extends EngagementService {
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8).fill(null).map(() => Engagement.fromFake());
  }
  async createEngagement(data: Engagement): Promise<Engagement> {
    return data;
  }
  async saveEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
  async launchEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
  async getConfig(): Promise<EngagementFormConfig> {
    return FakedSchema;
  }
}
